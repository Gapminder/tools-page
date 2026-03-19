import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4200;

// Virtual slug rewrite: /slug/* -> serve from root
// Any first path segment that doesn't match a real file is treated as a slug
app.use((req, res, next) => {
  const seg = req.path.split('/').filter(Boolean)[0];
  if (seg && !req.path.includes('.')) {
    req.url = req.url.replace(`/${seg}`, '') || '/';
  }
  next();
});

// Serve static files from build
app.use(express.static(path.join(__dirname, 'build')));

// SPA fallback: any unmatched route -> index.html
app.get((req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});