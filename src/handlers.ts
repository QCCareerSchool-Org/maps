import { Request, Response } from 'express';
import { getMap } from './maps';

export const handleMapGet = async (req: Request, res: Response): Promise<void> => {
  if (typeof req.query.location !== 'string') {
    res.status(400).send({ message: 'location missing' });
    return;
  }

  const map = await getMap(req.query.location);
  if (map) {
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'attachment; filename="map.png"');
    res.set('Expires', formatHeaderDate(map.expires));
    res.send(map.data);
  } else {
    res.status(404).send({ message: 'not found' });
  }
};

const formatHeaderDate = (d: Date): string => {
  return d.toUTCString(); // like 'Wed, 05 Jul 2023 19:50:33 GMT'
};
