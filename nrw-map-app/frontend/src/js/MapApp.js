// =============================================================================
// MapApp.js - App bootstrap for Leaflet map and region switching
// =============================================================================
import L from 'leaflet';
import { RegionManager } from './RegionManager.js';
import { MarkerInputManager } from './MarkerInputManager.js';

const map = L.map('map', {
  center: [51.5, 7.5],
  zoom: 7,
  zoomControl: true
});

// Base tile (OSM)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const regionManager = new RegionManager(map);

// Initial region
regionManager.switchToRegion();

// Wire controls
document.querySelectorAll('#controls [data-region]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-region');
    regionManager.switchToRegion(id);
  });
});

const markerInput = new MarkerInputManager(map);
markerInput.setupAddressSearch();
markerInput.setupCoordinateInput();

document.getElementById('click-mode').addEventListener('click', () => {
  markerInput.enableClickMode();
});