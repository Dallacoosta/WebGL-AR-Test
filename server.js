/**
 * server.js  –  local HTTPS dev server for CFD AR Viewer
 *
 * First run (once):
 *   npm install
 *
 * Every run after:
 *   node server.js
 *
 * Opens https://localhost:8443 automatically.
 * Camera works because it's localhost over HTTPS.
 */

const https   = require("https");
const http    = require("http");
const fs      = require("fs");
const path    = require("path");
const { execSync, exec } = require("child_process");

const PORT    = 8443;
const FOLDER  = __dirname;   // serve files from the same folder as this script

// ── MIME types ─────────────────────────────────────────────────────
const MIME = {
  ".html": "text/html",
  ".js":   "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".wasm": "application/wasm",
};

// ── Generate a self-signed certificate if one doesn't exist ────────
const CERT_KEY  = path.join(__dirname, "_cert.key");
const CERT_FILE = path.join(__dirname, "_cert.crt");

function ensureCert() {
  if (fs.existsSync(CERT_KEY) && fs.existsSync(CERT_FILE)) return;
  console.log("Generating self-signed certificate (first run only)...");
  try {
    execSync(
      `openssl req -x509 -newkey rsa:2048 -keyout "${CERT_KEY}" ` +
      `-out "${CERT_FILE}" -days 365 -nodes ` +
      `-subj "/CN=localhost"`,
      { stdio: "pipe" }
    );
    console.log("Certificate created.");
  } catch (e) {
    console.error("openssl not found. Falling back to plain HTTP on port 8080.");
    console.error("Camera may still work on localhost in Chrome.");
    startHTTP();
    return false;
  }
  return true;
}

// ── Request handler ────────────────────────────────────────────────
function handler(req, res) {
  let filePath = path.join(FOLDER, req.url === "/" ? "index.html" : req.url);

  // Prevent directory traversal
  if (!filePath.startsWith(FOLDER)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }

  // Default to index.html for directories
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`File not found: ${req.url}`);
      return;
    }
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": mime,
      // Required for camera access in iframes / cross-origin contexts
      "Cross-Origin-Opener-Policy":   "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    });
    res.end(data);
  });
}

// ── Open browser automatically ─────────────────────────────────────
function openBrowser(url) {
  const cmds = {
    win32:  `start "" "${url}"`,
    darwin: `open "${url}"`,
    linux:  `xdg-open "${url}"`,
  };
  const cmd = cmds[process.platform];
  if (cmd) exec(cmd, () => {});
}

// ── HTTPS server ───────────────────────────────────────────────────
function startHTTPS() {
  const options = {
    key:  fs.readFileSync(CERT_KEY),
    cert: fs.readFileSync(CERT_FILE),
  };
  https.createServer(options, handler).listen(PORT, () => {
    const url = `https://localhost:${PORT}`;
    console.log("\n╔══════════════════════════════════════════╗");
    console.log(`║  CFD AR Server running                   ║`);
    console.log(`║  ${url}                  ║`);
    console.log("║                                          ║");
    console.log("║  ⚠  First time: Chrome will warn about  ║");
    console.log('║     the cert. Click "Advanced" →         ║');
    console.log('║     "Proceed to localhost (unsafe)"      ║');
    console.log("║                                          ║");
    console.log("║  Camera will work after that.            ║");
    console.log("║  Press Ctrl+C to stop.                   ║");
    console.log("╚══════════════════════════════════════════╝\n");
    openBrowser(url);
  });
}

// ── HTTP fallback (if openssl not available) ───────────────────────
function startHTTP() {
  const fallbackPort = 8080;
  http.createServer(handler).listen(fallbackPort, () => {
    const url = `http://localhost:${fallbackPort}`;
    console.log(`\n HTTP server running at ${url}`);
    console.log(" (Camera works on localhost in Chrome even without HTTPS)\n");
    openBrowser(url);
  });
}

// ── Entry point ────────────────────────────────────────────────────
if (ensureCert() !== false) startHTTPS();
