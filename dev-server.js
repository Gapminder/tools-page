import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4200;

// Virtual slug rewrite: /slug/* -> serve from root
app.use((req, res, next) => {
  // if path starts with known virtual segments, strip them
  const slug = ['healthatlas', 'education', 'housing', 'test']; // add your test slugs
  const seg = req.path.split('/').filter(Boolean)[0];
  if (slug.includes(seg)) {
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