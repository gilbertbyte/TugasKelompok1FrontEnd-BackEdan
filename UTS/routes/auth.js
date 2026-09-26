const express = require("express");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const db = require("../db");

const router = express.Router();


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

function recordAttempt(username, success) {
  db.prepare("INSERT INTO login_attempts (username, success) VALUES (?, ?)").run(
    username,
    success ? 1 : 0
  );
}


function isLockedOut(username) {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS count FROM login_attempts
       WHERE username = ? AND success = 0
       AND attempted_at >= datetime('now', '-15 minutes')`
    )
    .get(username);
  return row.count >= 5;
}

router.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  if (isLockedOut(username)) {
    return res.status(429).json({
      error: "Too many failed attempts for this account. Try again in 15 minutes.",
    });
  }

  const user = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username);

  if (!user) {
    recordAttempt(username, false);
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    recordAttempt(username, false);
    return res.status(401).json({ error: "Invalid username or password." });
  }

  recordAttempt(username, true);

  
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: "Login failed. Please try again." });
    req.session.adminId = user.id;
    req.session.username = user.username;
    res.json({ ok: true, redirect: "/admin" });
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true, redirect: "/admin/login" });
  });
});

router.get("/me", (req, res) => {
  if (req.session && req.session.adminId) {
    return res.json({ loggedIn: true, username: req.session.username });
  }
  res.json({ loggedIn: false });
});

module.exports = router;
