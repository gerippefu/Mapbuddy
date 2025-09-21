// =============================================================================
// MarkerInputManager.js - Address search, click mode, coordinate input
// =============================================================================
import L from 'leaflet';

export class MarkerInputManager {
  constructor(map) {
    this.map = map;
    this.currentMarker = null;
    this.clickHandler = null;
    this.resultsEl = null;
  }

  setupAddressSearch() {
    const input = document.querySelector('#search input[name="q"]');
    const list = document.querySelector('#search .results');
    this.resultsEl = list;
    if (!input || !list) return;

    let debounceId;
    input.addEventListener('input', () => {
      clearTimeout(debounceId);
      const q = input.value.trim();
      if (!q) { list.innerHTML = ''; return; }
      debounceId = setTimeout(async () => {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`).then(r => r.json());
        list.innerHTML = '';
        res.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item.display_name;
          li.addEventListener('click', () => {
            const lat = Number(item.lat);
            const lon = Number(item.lon);
            this.#placeMarker([lat, lon], item.display_name);
            list.innerHTML = '';
            input.value = item.display_name;
          });
          list.appendChild(li);
        });
      }, 250);
    });
  }

  enableClickMode() {
    if (this.clickHandler) this.map.off('click', this.clickHandler);
    this.clickHandler = (e) => {
      const latlng = e.latlng;
      this.#placeMarker([latlng.lat, latlng.lng], 'Klick');
    };
    this.map.on('click', this.clickHandler);
    document.body.style.cursor = 'crosshair';
  }

  disableClickMode() {
    if (this.clickHandler) this.map.off('click', this.clickHandler);
    this.clickHandler = null;
    document.body.style.cursor = 'default';
  }

  setupCoordinateInput() {
    const latEl = document.querySelector('#coords input[name="lat"]');
    const lngEl = document.querySelector('#coords input[name="lng"]');
    const btn = document.querySelector('#coords button');
    if (!latEl || !lngEl || !btn) return;
    btn.addEventListener('click', () => {
      const lat = Number(latEl.value);
      const lng = Number(lngEl.value);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        this.#placeMarker([lat, lng], 'Koordinate');
      }
    });
  }

  #placeMarker([lat, lng], title) {
    if (this.currentMarker) this.map.removeLayer(this.currentMarker);
    this.currentMarker = L.marker([lat, lng], { title });
    this.currentMarker.addTo(this.map).bindPopup(`<b>${title}</b><br>${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();
    this.map.flyTo([lat, lng], Math.max(this.map.getZoom(), 14), { duration: 0.8 });
  }
}