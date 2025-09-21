import { Router } from 'express';
const router = Router();

// TODO: layer configs placeholder
router.get('/', (_req, res) => {
  res.json({ martin: { url: 'http://localhost:3001' } });
});

export default router;