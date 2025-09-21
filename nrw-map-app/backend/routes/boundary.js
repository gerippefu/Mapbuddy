import { Router } from 'express';
const router = Router();

// Placeholder: would proxy or serve boundary based on region/resolution
router.get('/:region/:resolution', (req, res) => {
  const { region, resolution } = req.params;
  res.json({ region, resolution, url: `/assets/regions/${region}.json` });
});

export default router;