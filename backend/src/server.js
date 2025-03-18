const express = require('express');
const path = require('path');
const cors = require('cors'); // Add CORS support

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Serve static files from the frontend build folder
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));

// API route
app.get('/api/message', (req, res) => {
  res.json({ text: 'YESSS.JS' });
});

// Serve index.html for all non-API routes (React SPA)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
