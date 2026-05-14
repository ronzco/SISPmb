import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export let db: any = null;

export async function getDb() {
  if (db) return db;
  
  const host = process.env.MYSQL_HOST || "localhost";
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "sipmb";
  const port = parseInt(process.env.MYSQL_PORT || "3306");

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
    });
    db = drizzle(connection, { schema, mode: "default" });
    console.log("Connected to MySQL database");
    return db;
  } catch (error) {
    console.error("Failed to connect to MySQL. Is XAMPP/MySQL running?", error);
    throw error;
  }
}
