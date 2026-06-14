import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("Starting server initialization...");
  console.log("Current working directory:", process.cwd());
  const fs = await import('fs');
  console.log("Files in current directory:", fs.readdirSync('.'));
  if (fs.existsSync('dist')) {
    console.log("Files in dist directory:", fs.readdirSync('dist'));
  }
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath = path.resolve(__dirname, "public");
  console.log(`Serving static files from: ${staticPath}`);

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (req, res) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    res.sendFile(path.join(staticPath, "index.html"), (err) => {
      if (err) {
        console.error(`Error sending index.html: ${err}`);
        res.status(500).send(err);
      }
    });
  });

  const port = parseInt(process.env.PORT || "3000", 10);
  const host = "0.0.0.0"; // Explicitly bind to all interfaces for Railway

  server.listen(port, host, () => {
    console.log(`Server is listening on ${host}:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
