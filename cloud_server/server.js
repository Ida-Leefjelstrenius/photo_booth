import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const photoCodes = new Map();

function generateCode() {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (photoCodes.has(code));
  return code;
}

function notifyDisplayScreens(code, url) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ code, url }));
    }
  });
}

// Use memory storage — upload buffer directly to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'photobooth',
        format: 'png',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
}

async function deleteFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted from Cloudinary: ${publicId}`);
  } catch (err) {
    console.error(`Failed to delete ${publicId}:`, err);
  }
}

app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    const code = generateCode();

    photoCodes.set(code, {
      url: result.secure_url,
      publicId: result.public_id
    });

    // Auto-delete after 48 hours
    setTimeout(() => {
      deleteFromCloudinary(result.public_id);
      photoCodes.delete(code);
    }, 48 * 60 * 60 * 1000);

    console.log(`New photo uploaded with code: ${code}`);
    notifyDisplayScreens(code, result.secure_url);
    res.json({ code });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/reupload', upload.single('photo'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    const code = generateCode();

    photoCodes.set(code, {
      url: result.secure_url,
      publicId: result.public_id
    });

    setTimeout(() => {
      deleteFromCloudinary(result.public_id);
      photoCodes.delete(code);
    }, 48 * 60 * 60 * 1000);

    console.log(`Re-uploaded with new code: ${code}`);
    notifyDisplayScreens(code, result.secure_url);
    res.json({ code });
  } catch (err) {
    console.error('Reupload failed:', err);
    res.status(500).json({ error: 'Reupload failed' });
  }
});

app.get('/download/:code', (req, res) => {
  const entry = photoCodes.get(req.params.code);
  if (!entry) {
    return res.status(404).json({ error: 'Photo not found or expired' });
  }
  res.json({ url: entry.url });
});

app.get('/latest', (req, res) => {
  if (photoCodes.size === 0) {
    return res.status(404).json({ error: 'No photos yet' });
  }
  const lastCode = [...photoCodes.keys()].at(-1);
  const entry = photoCodes.get(lastCode);
  res.json({ code: lastCode, url: entry.url });
});

const PORT = process.env.PORT || 3012;
server.listen(PORT, () => {
  console.log(`Cloud server running on port ${PORT}`);
});