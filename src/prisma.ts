import { Prisma, PrismaClient } from '@prisma/client';

const log: Prisma.LogLevel[] = process.env.NODE_ENV !== 'production'
  ? [ 'query', 'info', 'warn', 'error' ]
  : [];

export const prisma = new PrismaClient({ log });
