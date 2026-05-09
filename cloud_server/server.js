import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const photosDir = path.join(__dirname, 'photos');
if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir);

const photoCodes = new Map();

const codesFile = path.join(__dirname, 'codes.json');
if (fs.existsSync(codesFile)) {
  const data = JSON.parse(fs.readFileSync(codesFile));
  Object.entries(data).forEach(([code, filePath]) => photoCodes.set(code, filePath));
}

function saveCodesFile() {
  fs.writeFileSync(codesFile, JSON.stringify(Object.fromEntries(photoCodes)));
}

function scheduleDelete(code, filePath) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    photoCodes.delete(code);
    saveCodesFile();
    console.log(`Deleted photo for code ${code}`);
  }, 72 * 60 * 60 * 1000);
}

const storage = multer.diskStorage({
  destination: photosDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}.png`)
});

const upload = multer({ storage });

// Local server syncs photos here with code already generated
app.post('/sync', upload.single('photo'), (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code required' });
  const filePath = req.file.path;
  photoCodes.set(code, filePath);
  saveCodesFile();
  scheduleDelete(code, filePath);
  console.log(`Synced photo with code: ${code}`);
  res.json({ success: true, code });
});

app.get('/download/:code', (req, res) => {
  const filePath = photoCodes.get(req.params.code);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Photo not found or expired' });
  }
  res.sendFile(filePath);
});

app.get('/check/:code', (req, res) => {
  const exists = photoCodes.has(req.params.code) &&
    fs.existsSync(photoCodes.get(req.params.code));
  res.json({ exists });
});

const PORT = process.env.PORT || 3012;
app.listen(PORT, () => console.log(`Cloud server running on port ${PORT}`));