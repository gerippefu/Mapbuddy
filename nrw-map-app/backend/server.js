// =============================================================================
// server.js - Express server
// =============================================================================
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config/index.js';
import { initDb } from './config/db.js';

import regions from './routes/regions.js';
import boundary from './routes/boundary.js';
import markers from './routes/markers.js';
import routesApi from './routes/routes.js';
import districts from './routes/districts.js';
import layers from './routes/layers.js';
import themes from './routes/themes.js';
import geocode from './routes/geocode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

initDb();

const app = express();
app.use(cors({ origin: config.origin }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/regions', regions);
app.use('/api/boundary', boundary);
app.use('/api/markers', markers);
app.use('/api/routes', routesApi);
app.use('/api/districts', districts);
app.use('/api/layers', layers);
app.use('/api/themes', themes);
app.use('/api/geocode', geocode);

app.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
});