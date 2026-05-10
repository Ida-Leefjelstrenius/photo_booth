import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { createServer } from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'key.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.crt')),
};

const server = createServer(sslOptions, app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

const photosDir = path.join(__dirname, 'photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir);
}

const photoCodes = new Map();

const codesFile = path.join(__dirname, 'codes.json');
if (fs.existsSync(codesFile)) {
  const data = JSON.parse(fs.readFileSync(codesFile));
  Object.entries(data).forEach(([code, filePath]) => photoCodes.set(code, filePath));
  console.log(`Loaded ${photoCodes.size} codes from file`);
}

function saveCodesFile() {
  const data = Object.fromEntries(photoCodes);
  fs.writeFileSync(codesFile, JSON.stringify(data));
}

function generateCode() {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (photoCodes.has(code));
  return code;
}

function scheduleDelete(code, filePath) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted photo for code ${code}`);
    }
    photoCodes.delete(code);
    saveCodesFile();
  }, 72 * 60 * 60 * 1000);
}

function notifyDisplayScreens(code) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ code, url: `/download/${code}` }));
    }
  });
}

// ---- Cloud sync ----
const CLOUD_SERVER_URL = 'https://photobooth-production-0ce1.up.railway.app';
const syncQueue = new Set();

async function syncToCloud(code, filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('photo', blob, 'photo.png');
    formData.append('code', code);

    const response = await fetch(`${CLOUD_SERVER_URL}/sync`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log(`Synced code ${code} to cloud`);
      syncQueue.delete(code);
    } else {
      console.log(`Sync failed for code ${code}, will retry`);
    }
  } catch (err) {
    console.log(`No internet, queued code ${code} for later`);
  }
}

setInterval(() => {
  if (syncQueue.size > 0) {
    console.log(`Retrying sync for ${syncQueue.size} photos...`);
    for (const code of syncQueue) {
      const filePath = photoCodes.get(code);
      if (filePath) syncToCloud(code, filePath);
    }
  }
}, 2 * 60 * 1000);

// ---- Routes ----
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
  saveCodesFile();
  scheduleDelete(code, filePath);
  console.log(`New photo uploaded with code: ${code}`);
  notifyDisplayScreens(code);
  syncQueue.add(code);
  syncToCloud(code, filePath);
  res.json({ code });
});

app.get('/download/:code', (req, res) => {
  const code = req.params.code;
  const filePath = photoCodes.get(code);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Photo not found or expired' });
  }
  res.sendFile(filePath);
});

app.get('/latest', (req, res) => {
  if (photoCodes.size === 0) {
    return res.status(404).json({ error: 'No photos yet' });
  }
  const lastCode = [...photoCodes.keys()].at(-1);
  res.json({ code: lastCode, url: `/download/${lastCode}` });
});

server.listen(3011, () => {
  console.log('Server running on https port 3011');
});