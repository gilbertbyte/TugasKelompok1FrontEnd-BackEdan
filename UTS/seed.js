



const bcrypt = require("bcrypt");
const readline = require("readline");
const db = require("./db");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

(async () => {
  console.log("=== Create admin user ===");
  const username = (await ask("Username [admin]: ")).trim() || "admin";
  let password = await ask("Password (min 8 chars): ");

  if (!password || password.length < 8) {
    console.error("Password must be at least 8 characters. Aborting.");
    rl.close();
    process.exit(1);
  }

  const existing = db.prepare("SELECT id FROM admin_users WHERE username = ?").get(username);
  if (existing) {
    console.error(`User "${username}" already exists. Aborting.`);
    rl.close();
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  db.prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)").run(username, hash);

  console.log(`Admin user "${username}" created. You can now log in at /admin/login.`);
  rl.close();
})();
