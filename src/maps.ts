import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';

import config from './config';
import { fixPrismaReadDate, fixPrismaWriteDate } from './date';
import { logError } from './logger';
import { prisma } from './prisma';
import { binToUUID, createUUID, uuidToBin } from './uuid';

const zoom = 10; // city level
const size = 192;

type Map = {
  data: Buffer;
  expires: Date;
};

export const getMap = async (location: string): Promise<Map | false> => {
  const storedMap = await getStoredMap(location);
  if (storedMap) {
    return storedMap;
  }

  const googleMap = await getGoogleMap(location);

  if (googleMap) {
    const expires = new Date(new Date().getTime() + config.cacheTimeMs);

    // not awaiting this so that the response can be sent sooner
    storeMap(location, expires, googleMap).catch(logError);

    return { data: googleMap, expires };
  }

  return false;
};

/**
 * Retrieves a map from the filesystem
 * @param location the location
 * @returns the map, or false if the map isn't stored
 */
const getStoredMap = async (location: string): Promise<Map | false> => {
  // look up the map in the database
  const map = await prisma.storedMaps.findFirst({ where: { location } });

  // no record found
  if (!map) {
    return false;
  }

  // record found but expired
  if (fixPrismaReadDate(map.expires) < new Date()) {
    return false;
  }

  // try read to the map data from the filesystem but return false on error
  try {
    const file = await fs.readFile(path.join(config.filePath, binToUUID(map.filename)));

    return {
      data: file,
      expires: map.expires,
    };
  } catch (err) {
    logError('error reading file', err);
    return false;
  }
};

/**
 * Stores a map in the filesystem and records it in the database
 * @param location the location
 * @param expires the expiry date of the stored map
 * @param buffer the map
 */
const storeMap = async (location: string, expires: Date, buffer: Buffer): Promise<boolean> => {
  await prisma.$transaction(async transaction => {
    const map = await transaction.storedMaps.findFirst({ where: { location } });

    if (map) {
      await transaction.storedMaps.deleteMany({ where: { location } });

      // try to delete the file but ignore errors
      try {
        await fs.unlink(path.join(config.filePath, binToUUID(map.filename)));
      } catch (err) {
        logError('no file to delete', err);
      }
    }

    const uuid = createUUID();

    await transaction.storedMaps.create({
      data: {
        location,
        expires: fixPrismaWriteDate(expires),
        filename: uuidToBin(uuid),
      },
    });

    // try to write file but return false on error
    const filePath = path.join(config.filePath, uuid);
    try {
      await fs.writeFile(filePath, buffer);
    } catch (err) {
      logError(`error writing file to ${filePath}`, err);
      throw err;
    }
  });
  return true;
};

/**
 * Retreives a map from the Google Static Maps API
 * @param location the location
 * @returns the map, or false if the request failed
 */
const getGoogleMap = async (location: string): Promise<Buffer | false> => {
  const url = `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=${zoom}&size=${size}x${size}&key=${config.googleApiKey}`;
  const response = await fetch(url);
  if (response.ok) {
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  }
  return false;
};
