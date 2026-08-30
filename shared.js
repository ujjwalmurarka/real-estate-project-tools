// ============================================================
// Ranchi Tower — shared data & helpers
// Loaded by index.html, residential.html, summary.html, settings.html
// (plain <script src="shared.js">, no build step / bundler)
// ============================================================

// ---- Party colors — single source of truth, must match styles.css --p1..--p4 ----
const PARTY_COLORS = {
  1: { fill: "#7c6df2", dark: "#4a3dc4", bg: "#efecfe" },
  2: { fill: "#23b893", dark: "#0d6b56", bg: "#e2f7f1" },
  3: { fill: "#f0805a", dark: "#c14a28", bg: "#fdece5" },
  4: { fill: "#e0a72c", dark: "#966b0c", bg: "#fbf0d9" }
};

// ---- Shared settings: party names (used everywhere) + rates (kept separate per tool) ----
const SETTINGS_KEY = "ranchi-tower-settings";
const SETTINGS_DEFAULTS = {
  names: { 1: "Party 1", 2: "Party 2", 3: "Party 3", 4: "Builder" },
  commercial: { ground: 25000, f1: 12000, f2: 8000, f3: 6000, f4: 3000, ownerShare: 50, loadingGround: 1.5614, loadingUpper: 1.5709 },
  residential: { rate: 6000, ownerShare: 47 }
};

function loadSettings() {
  const s = {
    names: Object.assign({}, SETTINGS_DEFAULTS.names),
    commercial: Object.assign({}, SETTINGS_DEFAULTS.commercial),
    residential: Object.assign({}, SETTINGS_DEFAULTS.residential)
  };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p.names) Object.assign(s.names, p.names);
      if (p.commercial) Object.assign(s.commercial, p.commercial);
      if (p.residential) Object.assign(s.residential, p.residential);
    }
  } catch (e) { /* fall back to defaults */ }
  return s;
}

// ---- Commercial building data: floors, shops, carpet areas + box positions (% of floor image) ----
const COMMERCIAL_RESTAURANT_SQFT = 16981;
const COMMERCIAL_FLOORS = [{"key":"ground","label":"Ground floor","img":"ground","loadingKey":"groundLoading","rateKey":"ground","boxes":[{"name":"1A","carpet":876,"left":11.27,"top":51.47,"width":8.02,"height":25.21},{"name":"1B","carpet":876,"left":19.29,"top":51.47,"width":7.93,"height":25.21},{"name":"2","carpet":1300,"left":27.22,"top":51.47,"width":11.75,"height":25.21},{"name":"3","carpet":1280,"left":38.97,"top":51.47,"width":11.59,"height":25.21},{"name":"4","carpet":2760,"left":50.56,"top":30.99,"width":13.41,"height":46.22},{"name":"5","carpet":2790,"left":63.97,"top":30.99,"width":13.57,"height":46.22},{"name":"6","carpet":2850,"left":77.54,"top":30.99,"width":13.81,"height":46.22}]},{"key":"f1","label":"1st floor","img":"upper","loadingKey":"upperLoading","rateKey":"f1","boxes":[{"name":"1A","carpet":1450,"left":2.78,"top":46.74,"width":11.83,"height":29.41},{"name":"1B","carpet":1450,"left":14.6,"top":46.74,"width":11.83,"height":29.41},{"name":"2","carpet":1560,"left":26.43,"top":46.74,"width":12.7,"height":29.41},{"name":"3","carpet":1420,"left":39.13,"top":46.74,"width":11.59,"height":29.41},{"name":"4","carpet":1735,"left":50.71,"top":46.74,"width":14.05,"height":29.41},{"name":"5","carpet":1730,"left":64.76,"top":46.74,"width":14.13,"height":29.41},{"name":"6","carpet":1975,"left":78.89,"top":46.74,"width":16.11,"height":29.41},{"name":"9","carpet":880,"left":50.79,"top":23.74,"width":13.97,"height":16.18},{"name":"8","carpet":890,"left":64.76,"top":23.74,"width":14.13,"height":16.18},{"name":"7","carpet":1020,"left":78.89,"top":23.74,"width":16.11,"height":16.18}]},{"key":"f2","label":"2nd floor","img":"upper","loadingKey":"upperLoading","rateKey":"f2","boxes":[{"name":"1A","carpet":1450,"left":2.78,"top":46.74,"width":11.83,"height":29.41},{"name":"1B","carpet":1450,"left":14.6,"top":46.74,"width":11.83,"height":29.41},{"name":"2","carpet":1560,"left":26.43,"top":46.74,"width":12.7,"height":29.41},{"name":"3","carpet":1420,"left":39.13,"top":46.74,"width":11.59,"height":29.41},{"name":"4","carpet":1735,"left":50.71,"top":46.74,"width":14.05,"height":29.41},{"name":"5","carpet":1730,"left":64.76,"top":46.74,"width":14.13,"height":29.41},{"name":"6","carpet":1975,"left":78.89,"top":46.74,"width":16.11,"height":29.41},{"name":"9","carpet":880,"left":50.79,"top":23.74,"width":13.97,"height":16.18},{"name":"8","carpet":890,"left":64.76,"top":23.74,"width":14.13,"height":16.18},{"name":"7","carpet":1020,"left":78.89,"top":23.74,"width":16.11,"height":16.18}]},{"key":"f3","label":"3rd floor","img":"upper","loadingKey":"upperLoading","rateKey":"f3","boxes":[{"name":"1A","carpet":1450,"left":2.78,"top":46.74,"width":11.83,"height":29.41},{"name":"1B","carpet":1450,"left":14.6,"top":46.74,"width":11.83,"height":29.41},{"name":"2","carpet":1560,"left":26.43,"top":46.74,"width":12.7,"height":29.41},{"name":"3","carpet":1420,"left":39.13,"top":46.74,"width":11.59,"height":29.41},{"name":"4","carpet":1735,"left":50.71,"top":46.74,"width":14.05,"height":29.41},{"name":"5","carpet":1730,"left":64.76,"top":46.74,"width":14.13,"height":29.41},{"name":"6","carpet":1975,"left":78.89,"top":46.74,"width":16.11,"height":29.41},{"name":"9","carpet":880,"left":50.79,"top":23.74,"width":13.97,"height":16.18},{"name":"8","carpet":890,"left":64.76,"top":23.74,"width":14.13,"height":16.18},{"name":"7","carpet":1020,"left":78.89,"top":23.74,"width":16.11,"height":16.18}]}];

// ---- Residential building data: 2 blocks × 3 floor types each ----
const RESIDENTIAL_BLOCKS = [
  {
    id: "A", name: "Block A",
    rows: [
      { key: "1F",    label: "1st floor",              floors: 1,  unitsPerFloor: 4, sellablePerFloor: 7281,   step: 0.25, unitLabel: "flats" },
      { key: "2-25F", label: "2nd – 25th floor (each)", floors: 24, unitsPerFloor: 4, sellablePerFloor: 6370,   step: 0.25, unitLabel: "flats" },
      { key: "26F",   label: "26th floor (penthouse)",  floors: 1,  unitsPerFloor: 2, sellablePerFloor: 4322.5, step: 0.5,  unitLabel: "penthouses" }
    ]
  },
  {
    id: "B", name: "Block B",
    rows: [
      { key: "1F",    label: "1st floor",              floors: 1,  unitsPerFloor: 4, sellablePerFloor: 7260, step: 0.25, unitLabel: "flats" },
      { key: "2-25F", label: "2nd – 25th floor (each)", floors: 24, unitsPerFloor: 4, sellablePerFloor: 6590, step: 0.25, unitLabel: "flats" },
      { key: "26F",   label: "26th floor (penthouse)",  floors: 1,  unitsPerFloor: 2, sellablePerFloor: 4473, step: 0.5,  unitLabel: "penthouses" }
    ]
  }
];

// ---- Formatting helpers ----
function fmtSqft(n) { return Math.round(n).toLocaleString("en-IN"); }
function fmtCr(n) { return (n / 1e7).toFixed(2) + " Cr"; }
function fmtRs(n) { return "Rs " + Math.round(n).toLocaleString("en-IN"); }
