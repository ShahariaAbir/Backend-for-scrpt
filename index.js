const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const scriptsPath = path.join(__dirname, 'public/scripts');
if (!fs.existsSync(scriptsPath)) {
  fs.mkdirSync(scriptsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, scriptsPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage });

app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));

app.post('/upload', upload.single('jsfile'), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get('host')}/scripts/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

app.get('/', (req, res) => {
  res.send('JS Upload Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
