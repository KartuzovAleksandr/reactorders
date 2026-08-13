// lib/initDbOnce.ts
import "server-only";
import { initDb } from "../../prisma/initdb";

declare global {
    var initDbPromise: Promise<void> | undefined;
}

export function initDbOnce() {
    if (!globalThis.initDbPromise) {
        console.log("DATABASE_URL =", process.env.DATABASE_URL);
        // Если вывод: DATABASE_URL = undefined  →  проблема в загрузке .env
        globalThis.initDbPromise = initDb();
    }
    return globalThis.initDbPromise;
}