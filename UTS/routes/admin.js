const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Everything below this line requires a logged-in session
router.use(requireAuth);

// List stores
router.get("/api/stores", (req, res) => {
  const stores = db.prepare("SELECT * FROM stores ORDER BY created_at DESC").all();
  res.json(stores);
});

// Create a store
router.post("/api/stores", (req, res) => {
  const { nama, alamat, jam_buka, status, rating } = req.body || {};

  if (!nama || typeof nama !== "string" || !nama.trim()) {
    return res.status(400).json({ error: "Nama toko is required." });
  }

  const stmt = db.prepare(
    "INSERT INTO stores (nama, alamat, jam_buka, status, rating) VALUES (?, ?, ?, ?, ?)"
  );
  const result = stmt.run(
    nama.trim(),
    alamat || "",
    jam_buka || "",
    status || "Buka",
    rating || 0
  );

  const created = db.prepare("SELECT * FROM stores WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(created);
});

// Update a store
router.put("/api/stores/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT * FROM stores WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Store not found." });

  const { nama, alamat, jam_buka, status, rating } = req.body || {};

  db.prepare(
    `UPDATE stores SET nama = ?, alamat = ?, jam_buka = ?, status = ?, rating = ? WHERE id = ?`
  ).run(
    nama ?? existing.nama,
    alamat ?? existing.alamat,
    jam_buka ?? existing.jam_buka,
    status ?? existing.status,
    rating ?? existing.rating,
    id
  );

  const updated = db.prepare("SELECT * FROM stores WHERE id = ?").get(id);
  res.json(updated);
});

// Delete a store
router.delete("/api/stores/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT * FROM stores WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Store not found." });

  db.prepare("DELETE FROM stores WHERE id = ?").run(id);
  res.json({ ok: true });
});

module.exports = router;
