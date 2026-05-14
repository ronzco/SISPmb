import { defineConfig } from "drizzle-kit";

const host = process.env.MYSQL_HOST || "localhost";
const user = process.env.MYSQL_USER || "root";
const password = process.env.MYSQL_PASSWORD || "";
const database = process.env.MYSQL_DATABASE || "sipmb";
const port = process.env.MYSQL_PORT || "3306";

const connectionString = process.env.DATABASE_URL || `mysql://${user}:${password}@${host}:${port}/${database}`;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
