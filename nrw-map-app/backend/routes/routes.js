import { Router } from 'express';
const router = Router();

// TODO: OSRM proxy placeholder
router.get('/', (_req, res) => {
  res.json({ todo: 'Integrate OSRM routing in later milestone' });
});

export default router;