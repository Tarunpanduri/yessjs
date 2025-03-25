import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from message API!' });
});

export default router; // ✅ Ensure it's an ES module
