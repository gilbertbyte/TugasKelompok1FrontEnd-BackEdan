const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "data", "app.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

// Admin users table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Failed login attempts, for basic brute-force throttling per username
db.exec(`
  CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    attempted_at TEXT DEFAULT CURRENT_TIMESTAMP,
    success INTEGER NOT NULL
  )
`);

// Example admin-managed content: stores (matches the public site's "Toko" concept)
db.exec(`
  CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    alamat TEXT,
    jam_buka TEXT,
    status TEXT DEFAULT 'Buka',
    rating REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
