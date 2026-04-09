import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

declare global {
  var prisma: PrismaClient | undefined;
}

const dbUrl = process.env.DATABASE_URL ?? "";
const dbPath = dbUrl.replace("file:", "");
const adapter = new PrismaBetterSqlite3({ url: dbPath });

const prisma = global.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
