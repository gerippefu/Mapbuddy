import { Router } from 'express';
const router = Router();

// Example: list supported regions
router.get('/', (_req, res) => {
  res.json([
    { id: 'NRW', name: 'Nordrhein-Westfalen' },
    { id: 'DE', name: 'Deutschland' },
    { id: 'WORLD', name: 'Welt' }
  ]);
});

export default router;