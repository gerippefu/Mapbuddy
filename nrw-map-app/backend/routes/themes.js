import { Router } from 'express';
const router = Router();

// TODO: theme endpoints placeholder
router.get('/', (_req, res) => {
  res.json({ theme: 'sat1', colors: { primary: '#e60000' } });
});

export default router;