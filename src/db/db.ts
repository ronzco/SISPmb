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
      connectTimeout: 2000, 
    });
    db = drizzleMysql(connection, { schema, mode: "default" });
    console.log("✅ Terhubung ke MySQL (XAMPP)");
    return db;
  } catch (error: any) {
    console.warn(`⚠️ Gagal terhubung ke MySQL XAMPP: ${error.message}. Menggunakan SQLite sebagai cadangan.`);
    
    // Fallback ke SQLite agar aplikasi tetap bisa jalan di AI Studio
    const sqlite = new Database("local.db");
    db = drizzleSqlite(sqlite, { schema });
    isSqlite = true;

    // Bootstrap tables if SQLite (Quick hack for preview)
    try {
      console.log("🛠️ Bootstrapping SQLite tables...");
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          phone TEXT,
          role TEXT NOT NULL DEFAULT 'applicant',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS applications (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          full_name TEXT NOT NULL,
          email TEXT,
          program TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'draft',
          submitted_at DATETIME,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          birth_place TEXT,
          birth_date TEXT,
          gender TEXT,
          address TEXT,
          phone TEXT,
          previous_school TEXT,
          grad_year TEXT,
          major TEXT,
          participant_number TEXT,
          selection_code TEXT,
          score INTEGER,
          re_registration_paid INTEGER DEFAULT 0
        );
        -- Migration: Add email if missing
        PRAGMA table_info(applications);
      `);
      
      // Ensure specific columns exist
      const cols = sqlite.prepare("PRAGMA table_info(applications)").all() as any[];
      if (!cols.find(c => c.name === 'email')) {
        sqlite.exec("ALTER TABLE applications ADD COLUMN email TEXT;");
      }
      if (!cols.find(c => c.name === 're_registration_paid')) {
        sqlite.exec("ALTER TABLE applications ADD COLUMN re_registration_paid INTEGER DEFAULT 0;");
      }

      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS documents (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          type TEXT NOT NULL,
          url TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          amount DECIMAL(15,2) NOT NULL,
          method TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          transaction_id TEXT NOT NULL,
          paid_at DATETIME
        );
        CREATE TABLE IF NOT EXISTS announcements (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'info',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS fee_configs (
          id TEXT PRIMARY KEY,
          description TEXT NOT NULL,
          amount DECIMAL(15,2) NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS activity_logs (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          action TEXT NOT NULL,
          details TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("✅ SQLite Tables bootstrapped and verified.");
    } catch (bootstrapError) {
      console.error("❌ Failed to bootstrap SQLite tables:", bootstrapError);
    }

    return db;
  }
}
