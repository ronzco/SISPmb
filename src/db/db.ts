import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";
import * as schema from "./schema.js";

export let db: any = null;
let isSqlite = false;

export async function getDb() {
  if (db) return db;

  const host = process.env.MYSQL_HOST || "localhost";
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "sipmb";
  const port = parseInt(process.env.MYSQL_PORT || "3306");

  try {
    // Mencoba koneksi ke MySQL (XAMPP)
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 2000, // Timeout cepat agar tidak gantung
    });
    db = drizzleMysql(connection, { schema, mode: "default" });
    console.log("✅ Terhubung ke MySQL (XAMPP)");
    return db;
  } catch (error) {
    console.warn("⚠️ Gagal terhubung ke MySQL XAMPP. Menggunakan SQLite sebagai cadangan di lingkungan Preview.");
    
    // Fallback ke SQLite agar aplikasi tetap bisa jalan di AI Studio
    const sqlite = new Database("local.db");
    db = drizzleSqlite(sqlite, { schema });
    isSqlite = true;
    return db;
  }
}
