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

// Create photos folder if it doesn't exist
const photosDir = path.join(__dirname, 'photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir);
}

// Store codes and their photo paths in memory
const photoCodes = new Map();

// Generate a random 4-digit code
function generateCode() {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (photoCodes.has(code)); // make sure code is unique
  return code;
}

// Auto-delete photos after 48 hours
function scheduleDelete(code, filePath) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted photo for code ${code}`);
    }
    photoCodes.delete(code);
  }, 48 * 60 * 60 * 1000); // 48 hours
}

// Upload endpoint
const storage = multer.diskStorage({
  destination: photosDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.png`);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('photo'), (req, res) => {
  const code = generateCode();
  const filePath = req.file.path;
  photoCodes.set(code, filePath);
  scheduleDelete(code, filePath);
  console.log(`New photo uploaded with code: ${code}`);
  res.json({ code });
});

// Download endpoint
app.get('/download/:code', (req, res) => {
  const code = req.params.code;
  const filePath = photoCodes.get(code);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Photo not found or expired' });
  }
  res.sendFile(filePath);
});

// Latest photo endpoint (for display screen)
app.get('/latest', (req, res) => {
  if (photoCodes.size === 0) {
    return res.status(404).json({ error: 'No photos yet' });
  }
  const lastCode = [...photoCodes.keys()].at(-1);
  const filePath = photoCodes.get(lastCode);
  res.json({ code: lastCode, url: `/download/${lastCode}` });
});

app.listen(3011, () => {
  console.log('Server running on port 3011');
});