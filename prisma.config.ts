// prisma.config.ts
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        seed: "tsx ./prisma/seed.ts",
    },

    datasource: {
        url: "file:./orders.db",
        // url: env("DATABASE_URL"),
    },
});