import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `globalThis` object in development to prevent
// exhausting your database connection limit during development.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;