// =============================================================================
// RegionManager.js - Region switching and map masking
// =============================================================================
// MOBILE TODOs:
// - [ ] M1: Region-System Integration
// - [ ] M3: Marker-Input Methods
// - [ ] M4: Navigation Integration
//
// DESKTOP TODOs:
// - [ ] Implementiere switchToRegion()
// - [ ] Teste mit allen 3 Regionen
// - [ ] Performance-Optimierung
//
// CURSOR CONTEXT:
// - Dependencies: leaflet, leaflet.vectorgrid
// - API-Endpoints: none needed for static assets
// - Related-Files: MapApp.js, sat1.css
// =============================================================================

import L from 'leaflet';

export class RegionManager {
  constructor(map) {
    this.map = map;
    this.currentRegionId = null;
    this.maskLayer = null;
  }

  // TODO M1: Implement actual mask using leaflet.mask plugin when added
  async switchToRegion(regionId) {
    // Load persisted region if none provided
    const targetRegionId = regionId ?? window.localStorage.getItem('activeRegion') ?? 'NRW';

    // Load GeoJSON for region outline
    const regionToAsset = {
      NRW: '/assets/regions/nrw.json',
      DE: '/assets/regions/deutschland.json',
      WORLD: '/assets/regions/world.json'
    };

    const assetPath = regionToAsset[targetRegionId];
    if (!assetPath) return;

    const geo = await fetch(assetPath).then(r => r.json());

    // Remove old mask layer if exists
    if (this.maskLayer) {
      this.map.removeLayer(this.maskLayer);
      this.maskLayer = null;
    }

    // Build a mask: a large world polygon with region ring(s) as holes (SVG evenodd)
    const worldRing = [
      [85, -180],
      [85, 180],
      [-85, 180],
      [-85, -180]
    ];

    const rings = this.#extractRingsLatLng(geo);
    const mask = L.polygon([worldRing, ...rings], {
      stroke: false,
      fillColor: '#000',
      fillOpacity: 0.5,
      fillRule: 'evenodd'
    });
    mask.addTo(this.map);
    this.maskLayer = mask;

    // Optional: add a thin outline for the region border
    const outline = L.geoJSON(geo, { style: { color: '#e60000', weight: 2, fill: false } });
    outline.addTo(this.map);

    // Fit or fly to region
    const bounds = outline.getBounds();
    const center = bounds.getCenter();
    const zoom = this.map.getBoundsZoom(bounds);
    this.map.flyTo(center, zoom, { duration: 1.2 });

    // Persist
    this.currentRegionId = targetRegionId;
    window.localStorage.setItem('activeRegion', targetRegionId);
  }

  #extractRingsLatLng(geojson) {
    const rings = [];
    const eachCoord = (coords) => coords.map(([lng, lat]) => [lat, lng]);
    const pushPolygon = (poly) => {
      // exterior ring only for mask hole
      if (poly && poly[0]) rings.push(eachCoord(poly[0]));
    };
    const { type } = geojson;
    if (type === 'FeatureCollection') {
      for (const f of geojson.features) {
        if (!f.geometry) continue;
        if (f.geometry.type === 'Polygon') pushPolygon(f.geometry.coordinates);
        if (f.geometry.type === 'MultiPolygon') {
          for (const p of f.geometry.coordinates) pushPolygon(p);
        }
      }
    } else if (type === 'Feature') {
      const g = geojson.geometry;
      if (g.type === 'Polygon') pushPolygon(g.coordinates);
      if (g.type === 'MultiPolygon') {
        for (const p of g.coordinates) pushPolygon(p);
      }
    } else if (type === 'Polygon') {
      pushPolygon(geojson.coordinates);
    } else if (type === 'MultiPolygon') {
      for (const p of geojson.coordinates) pushPolygon(p);
    }
    return rings;
  }
}