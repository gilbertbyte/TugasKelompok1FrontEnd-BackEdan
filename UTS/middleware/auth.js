// Blocks access to protected routes unless the session has a logged-in admin user.
function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }

  // For API/XHR calls, respond with JSON; for page loads, redirect to login.
  if (req.originalUrl.startsWith("/admin/api/")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  return res.redirect("/admin/login");
}

module.exports = { requireAuth };
