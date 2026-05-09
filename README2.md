# Photo Booth Project

A web-based photo booth application with green screen functionality. Visitors stand in front of a green screen, a photo is taken on a dedicated phone, the background is replaced, and visitors receive a 4-digit code to download their photo later.

---

## Requirements

### System (install these manually on any new computer)

| Software | Download | Check version |
|---|---|---|
| Node.js (v18+) | [nodejs.org](https://nodejs.org) | `node --version` |
| Git | [git-scm.com](https://git-scm.com) | `git --version` |

---

## Setup on a New Computer

### 1. Clone the repository
```powershell
git clone https://github.com/your-username/photo_booth.git
cd photo_booth
```

### 2. Install frontend dependencies
```powershell
npm install
```

### 3. Install backend dependencies
```powershell
cd server
npm install
cd ..
```

### 4. Copy SSL certificates to server folder
The `certificate/` folder contains `cert.crt` and `key.key`.
Copy them to the `server/` folder:
```powershell
copy certificate\cert.crt server\cert.crt
copy certificate\key.key server\key.key
```

---

## Running the Project

You need **two PowerShell windows** open at the same time.

### Window 1 — Frontend (React)
```powershell
cd photo_booth
npm run dev
```
Frontend runs at: `https://192.168.X.X:3010`

### Window 2 — Backend (Express)
```powershell
cd photo_booth/server
node server.js
```
Backend runs at: `https://192.168.X.X:3011`

---

## Event Setup (In the Tent)

### Step 1 — Enable laptop hotspot
- Windows Settings → Network & Internet → Mobile Hotspot → Turn on
- Note your laptop's IP address:
```powershell
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (e.g. `192.168.0.102`).

### Step 2 — Update IP address
In `src/api.js` and `src/Display.jsx`, update the IP to match your laptop:
```javascript
const SERVER_URL = 'https://192.168.X.X:3011';  // replace X.X with your IP
```

### Step 3 — Start both servers
Run both PowerShell windows as described above.

### Step 4 — Connect phone to hotspot
Connect the dedicated photo booth phone to the laptop's hotspot.

### Step 5 — Trust the certificate (one time only)
On the phone browser:
1. Open `https://192.168.X.X:3011` → click Advanced → Proceed anyway
2. Open `https://192.168.X.X:3010` → click Advanced → Proceed anyway

### Step 6 — Open the display screen
On the laptop screen, open:
```
https://192.168.X.X:3010/display
```

### Step 7 — Open the camera on the phone
On the phone, open:
```
https://192.168.X.X:3010
```

---

## How to Use (For Operators)

1. Visitor stands in front of the green screen
2. Operator taps **Take Photo** on the phone
3. Operator taps **Use Picture** — green screen is applied and photo uploads
4. A **4-digit code** appears on screen — tell the visitor their code
5. Photo appears automatically on the display screen
6. Visitor goes home and visits the website to download their photo

---

## Pages

| URL | Purpose | Used by |
|---|---|---|
| `/` | Camera + green screen | Operator phone |
| `/display` | Shows latest photo fullscreen | Laptop screen in tent |
| `/view-picture?code=XXXX` | Shows merged photo + code | Operator phone after photo |
| `/get-photo` | Visitor types code to download | Visitor at home |

---

## Project Structure

```
photo_booth/
├── certificate/          ← SSL certificates
│   ├── cert.crt
│   └── key.key
├── server/               ← Express backend
│   ├── server.js
│   ├── package.json
│   ├── cert.crt          ← copy of certificate
│   ├── key.key           ← copy of certificate
│   └── photos/           ← uploaded photos (auto-created, not in git)
├── src/                  ← React frontend
│   ├── assets/           ← background images
│   ├── api.js            ← server communication
│   ├── App.jsx
│   ├── Camera.jsx        ← main camera + green screen page
│   ├── Display.jsx       ← display screen page
│   ├── ViewPicture.jsx   ← shows merged photo + code
│   ├── PhotoContext.jsx  ← shared photo state
│   ├── router.jsx        ← page routing
│   └── styles.js         ← all styles
├── vite.config.js
└── package.json
```

---

## Dependencies

### Frontend
- react, react-dom
- react-router-dom
- vite
- @vitejs/plugin-basic-ssl
- @vitejs/plugin-react

### Backend
- express
- cors
- multer
- ws

---

## Privacy & GDPR

- No personal information is collected (no name, email, or phone number)
- Photos are stored temporarily and **automatically deleted after 48 hours**
- Only a random 4-digit code is used to identify photos
- All data is stored locally on the laptop during the event

---

## Troubleshooting

**Camera not working on phone**
- Make sure you're on `https://` not `http://`
- Accept the certificate warning (Advanced → Proceed anyway)
- Try switching camera with the Switch Camera button

**Upload failed**
- Check that the backend server is running (Window 2)
- Check that the IP address in `api.js` matches your laptop's current IP
- Make sure the phone is connected to the laptop hotspot

**Display screen not updating**
- Check that both servers are running
- Refresh the display page
- Check browser console for WebSocket errors

**Server loses all codes after restart**
- Codes are saved to `server/codes.json` automatically
- Photos in `server/photos/` survive restart as long as the files exist
