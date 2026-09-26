require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

const authRoutes = require("./routes/auth");
const adminApiRoutes = require("./routes/admin");
const { requireAuth } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.SESSION_SECRET) {
  console.error(
    "Missing SESSION_SECRET in your .env file. Copy .env.example to .env and set a real value before starting the server."
  );
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions are stored server-side in SQLite (data/sessions.db), not just in the cookie.
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.db", dir: path.join(__dirname, "data") }),
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE === "true", // set true when served over HTTPS
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  })
);

// ---------- Public site ----------
app.use(express.static(path.join(__dirname, "public")));

// ---------- Auth endpoints (login/logout/me) ----------
app.use("/admin/auth", authRoutes);

// ---------- Admin login page (public, but redirect away if already logged in) ----------
app.get("/admin/login", (req, res) => {
  if (req.session && req.session.adminId) {
    return res.redirect("/admin");
  }
  res.sendFile(path.join(__dirname, "admin", "login.html"));
});

// ---------- Admin static assets (css/js for the admin panel itself) ----------
// These are harmless without auth (just styling/scripts), the *data* is protected via the API.
app.use("/admin/assets", express.static(path.join(__dirname, "admin", "assets")));

// ---------- Protected admin page ----------
app.get("/admin", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "dashboard.html"));
});

// ---------- Protected admin API ----------
app.use("/admin", adminApiRoutes);

// ---------- 404 fallback ----------
app.use((req, res) => {
  res.status(404).send("Not found");
});

app.listen(PORT, () => {
  console.log(`Pisang Ijo server running at http://localhost:${PORT}`);
  console.log(`Admin panel at http://localhost:${PORT}/admin (login required)`);
});
