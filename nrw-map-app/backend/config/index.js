export const config = {
  port: Number(process.env.PORT || 3000),
  origin: process.env.ORIGIN || 'http://localhost:5173',
  nominatimUrl: process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search'
};