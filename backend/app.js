const fs = require("fs");
const path = require("path");
const express = require("express");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
app.use(express.json());

const readmePath = path.join(__dirname, "README.md");
const escapeHtml = (text = "") =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

app.get("/", (req, res) => {
  let readme = "";
  try {
    readme = fs.readFileSync(readmePath, "utf8");
  } catch (err) {
    readme = `Unable to load README: ${err.message}`;
  }

  const titleMatch = readme.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : "API";

  res.type("html").send(`
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 40px; color: #1a1a1a; line-height: 1.6; }
    .card { max-width: 840px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); background: #fff; }
    h1 { margin-top: 0; font-size: 28px; }
    pre { white-space: pre-wrap; background: #0b1021; color: #e8edf7; padding: 20px; border-radius: 10px; overflow: auto; font-size: 14px; }
    .muted { color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(title)}</h1>
    <div class="muted">API information sourced from README.md</div>
    <pre>${escapeHtml(readme)}</pre>
  </div>
</body>
</html>`);
});

app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reports", reportRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.error || "InternalError",
    message: err.message || "Something went wrong"
  });
});

module.exports = app;
