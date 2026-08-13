// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";
import fs from "node:fs";

const dbPath = path.join(process.cwd(), "orders.db");

// Проверка при загрузке модуля БД
console.log("DB exists:", fs.existsSync(dbPath), dbPath);
if (!fs.existsSync(dbPath)) {
    throw new Error(`DB file not found: ${dbPath}`);
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma(): PrismaClient {
    const adapter = new PrismaLibSql({
        url: `file:${dbPath}`
    });

    return new PrismaClient({
        adapter
    });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}