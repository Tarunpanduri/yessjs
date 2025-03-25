import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import messageRoute from './api/message'; // ✅ Correct relative path

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// API Routes
app.use('/api/message', messageRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
