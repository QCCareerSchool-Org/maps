export const getDate = (): Date => new Date();

export function fixPrismaReadDate(d: Date): Date;
export function fixPrismaReadDate(d: null): null;
export function fixPrismaReadDate(d: Date | null): Date | null {
  if (d === null) { return null; }
  return new Date(`${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}T${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')}.${d.getUTCMilliseconds().toString().padStart(2, '0')}`);
}

export function fixPrismaWriteDate(d: Date): Date;
export function fixPrismaWriteDate(d: null): null;
export function fixPrismaWriteDate(d: Date | null): Date | null {
  if (d === null) { return null; }
  return new Date(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(2, '0')}Z`);
}
