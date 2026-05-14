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

    // Auto-migration for MySQL
    try {
      console.log("🛠️ Memeriksa struktur database MySQL...");
      
      // Ensure tables exist
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          role VARCHAR(50) NOT NULL DEFAULT 'applicant',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS applications (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          program VARCHAR(255) NOT NULL,
          major VARCHAR(255),
          status VARCHAR(50) NOT NULL DEFAULT 'draft',
          birth_place VARCHAR(255),
          birth_date VARCHAR(50),
          gender VARCHAR(50),
          address TEXT,
          phone VARCHAR(50),
          previous_school VARCHAR(255),
          grad_year VARCHAR(10),
          participant_number VARCHAR(50),
          selection_code VARCHAR(100),
          score INT,
          re_registration_paid TINYINT(1) DEFAULT 0,
          submitted_at TIMESTAMP NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS documents (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          type VARCHAR(100) NOT NULL,
          url TEXT NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS payments (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          amount DECIMAL(15,2) NOT NULL,
          method VARCHAR(100) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          category VARCHAR(100) NOT NULL DEFAULT 'registration',
          transaction_id VARCHAR(255) NOT NULL,
          paid_at TIMESTAMP NULL
        )
      `);

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS announcements (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          type VARCHAR(50) NOT NULL DEFAULT 'info',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS fee_configs (
          id VARCHAR(255) PRIMARY KEY,
          description VARCHAR(255) NOT NULL,
          amount DECIMAL(15,2) NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Sync columns for applications (Robust Migration)
      const [rows]: any = await connection.execute("SHOW COLUMNS FROM applications");
      const columns = rows.map((r: any) => r.Field);
      
      const missingCols = [
        { name: 'selection_code', type: 'VARCHAR(100)' },
        { name: 'participant_number', type: 'VARCHAR(50)' },
        { name: 'email', type: 'VARCHAR(255)' },
        { name: 'score', type: 'INT' },
        { name: 're_registration_paid', type: 'TINYINT(1) DEFAULT 0' },
        { name: 'birth_place', type: 'VARCHAR(255)' },
        { name: 'birth_date', type: 'VARCHAR(50)' },
        { name: 'gender', type: 'VARCHAR(50)' },
        { name: 'address', type: 'TEXT' },
        { name: 'phone', type: 'VARCHAR(50)' },
        { name: 'previous_school', type: 'VARCHAR(255)' },
        { name: 'grad_year', type: 'VARCHAR(10)' },
        { name: 'major', type: 'VARCHAR(255)' },
        { name: 'submitted_at', type: 'TIMESTAMP NULL' }
      ];

      for (const col of missingCols) {
        if (!columns.includes(col.name)) {
          try {
            await connection.execute(`ALTER TABLE applications ADD COLUMN ${col.name} ${col.type}`);
            console.log(`✅ Ditambahkan kolom '${col.name}' ke MySQL`);
          } catch (e: any) {
            console.warn(`⚠️ Gagal menambah kolom ${col.name}: ${e.message}`);
          }
        }
      }

      // Sync columns for payments
      const [payRows]: any = await connection.execute("SHOW COLUMNS FROM payments");
      const payColumns = payRows.map((r: any) => r.Field);
      if (!payColumns.includes('category')) {
        await connection.execute("ALTER TABLE payments ADD COLUMN category VARCHAR(100) DEFAULT 'registration'");
        console.log("✅ Ditambahkan kolom 'category' ke tabel payments (MySQL)");
      }

      // Check if announcements table has type field
      const [annRows]: any = await connection.execute("SHOW COLUMNS FROM announcements");
      const annColumns = annRows.map((r: any) => r.Field);
      if (!annColumns.includes('type')) {
        await connection.execute("ALTER TABLE announcements ADD COLUMN type VARCHAR(50) DEFAULT 'info'");
      }
    } catch (migError) {
      console.warn("⚠️ Gagal melakukan auto-migration MySQL:", migError.message);
    }

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

      // Migration: Add category to payments if missing
      const payCols = sqlite.prepare("PRAGMA table_info(payments)").all() as any[];
      if (!payCols.find(c => c.name === 'category')) {
        sqlite.exec("ALTER TABLE payments ADD COLUMN category TEXT DEFAULT 'registration';");
        console.log("✅ Ditambahkan kolom 'category' ke tabel payments (SQLite)");
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
          category TEXT NOT NULL DEFAULT 'registration',
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
