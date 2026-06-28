import createGlobe from 'https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm';

// 带时间的城市（tz 为 IANA 时区名，仅用于显示当地时间，不是地理坐标）
const TIME_CITIES = [
  { id: 'bj', name: 'Beijing', lat: 39.9042, lng: 116.4074, tz: 'Asia/Shanghai', size: 0.07, color: [1, 0.62, 0.22] },
  { id: 'tky', name: 'Tokyo', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo', size: 0.06, color: [0.92, 0.58, 1] },
  { id: 'nyc', name: 'New York', lat: 40.7128, lng: -74.006, tz: 'America/New_York', size: 0.06, color: [0.42, 0.82, 1] },
  { id: 'ldn', name: 'London', lat: 51.5074, lng: -0.1278, tz: 'Europe/London', size: 0.06, color: [0.52, 0.96, 0.62] },
  { id: 'sg', name: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore', size: 0.055, color: [0.35, 0.98, 0.78] },
  { id: 'la', name: 'Los Angeles', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles', size: 0.055, color: [0.35, 0.78, 1] },
  { id: 'par', name: 'Paris', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris', size: 0.055, color: [0.75, 0.65, 1] },
  { id: 'mow', name: 'Moscow', lat: 55.7558, lng: 37.6173, tz: 'Europe/Moscow', size: 0.055, color: [0.55, 0.92, 0.62] },
  { id: 'cbr', name: 'Canberra', lat: -35.2809, lng: 149.13, tz: 'Australia/Canberra', size: 0.05, color: [0.95, 0.55, 0.45] },
];

// 国内城市/省份（省会坐标；仅显示地名，不显示时间）
const REGIONAL = [
  { id: 'fs', name: '佛山', lat: 23.0218, lng: 113.1219, size: 0.058, color: [1, 0.78, 0.28] },
  { id: 'gz', name: '广州', lat: 23.1291, lng: 113.2644, size: 0.05, color: [1, 0.5, 0.35] },
  { id: 'hk', name: '香港', lat: 22.3193, lng: 114.1694, size: 0.05, color: [1, 0.42, 0.38] },
  { id: 'sz', name: '深圳', lat: 22.5431, lng: 114.0579, size: 0.05, color: [1, 0.55, 0.4] },
  { id: 'gx', name: '广西', lat: 22.817, lng: 108.3665, size: 0.045, color: [0.55, 0.92, 0.55] },
  { id: 'hn', name: '湖南', lat: 28.2282, lng: 112.9388, size: 0.045, color: [0.95, 0.55, 0.55] },
  { id: 'sc', name: '四川', lat: 30.5728, lng: 104.0668, size: 0.045, color: [0.85, 0.6, 1] },
  { id: 'fj', name: '福建', lat: 26.0745, lng: 119.2965, size: 0.045, color: [0.5, 0.85, 0.95] },
];

const ALL_CITIES = [...REGIONAL, ...TIME_CITIES];
const FOCUS = { lat: 23.02, lng: 113.12 };

const DPR = 2;

function focusOnLocation(lat, lng) {
  return {
    phi: Math.PI - (lng * Math.PI) / 180,
    theta: ((lat * Math.PI) / 180) * 0.42,
  };
}

function formatCityTime(timezone) {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch (error) {
    return '--:--';
  }
}

function createCityLabels(anchorRoot, cities) {
  anchorRoot.querySelectorAll('.cobe-city-label').forEach((el) => el.remove());

  return cities.map((city) => {
    const label = document.createElement('span');
    label.className = city.tz ? 'cobe-city-label cobe-city-label--time' : 'cobe-city-label';
    label.style.positionAnchor = `--cobe-${city.id}`;
    label.style.setProperty('opacity', `var(--cobe-visible-${city.id}, 0)`);

    const nameEl = document.createElement('span');
    nameEl.className = 'cobe-city-label-name';
    nameEl.textContent = city.name;
    label.appendChild(nameEl);

    let timeEl = null;
    if (city.tz) {
      timeEl = document.createElement('span');
      timeEl.className = 'cobe-city-label-time';
      timeEl.textContent = formatCityTime(city.tz);
      label.appendChild(timeEl);
    }

    anchorRoot.appendChild(label);
    return { timeEl, city };
  });
}

function initCobeGlobe(canvas) {
  const container = canvas.closest('.cobe-globe-wrap');
  if (!container) {
    return;
  }

  const focus = focusOnLocation(FOCUS.lat, FOCUS.lng);
  let phi = focus.phi;
  let theta = focus.theta;
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let globe = null;
  let labelEntries = [];
  let displaySize = 0;
  let lastTimeRefresh = 0;

  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';

  function measureDisplaySize() {
    displaySize = Math.max(Math.round(container.getBoundingClientRect().width), 120);
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;
    return displaySize;
  }

  function createGlobeInstance() {
    const size = measureDisplaySize();
    const markers = ALL_CITIES.map((city) => ({
      id: city.id,
      location: [city.lat, city.lng],
      size: city.size,
      color: city.color,
    }));

    if (globe) {
      globe.update({ width: size, height: size, phi, theta, markers });
      return;
    }

    globe = createGlobe(canvas, {
      devicePixelRatio: DPR,
      width: size,
      height: size,
      phi,
      theta,
      dark: 0.28,
      diffuse: 2.05,
      mapSamples: 26000,
      mapBrightness: 14,
      mapBaseBrightness: 0.1,
      baseColor: [0.28, 0.74, 0.96],
      markerColor: [1, 0.72, 0.42],
      glowColor: [0.58, 0.9, 1],
      markerElevation: 0.05,
      markers,
    });

    const anchorRoot = canvas.parentElement;
    if (anchorRoot) {
      labelEntries = createCityLabels(anchorRoot, ALL_CITIES);
    }
  }

  function animate(now) {
    if (!isDragging) {
      phi += 0.004;
    }

    if (globe) {
      globe.update({ phi, theta });
    }

    if (!lastTimeRefresh || now - lastTimeRefresh > 30000) {
      lastTimeRefresh = now;
      labelEntries.forEach(({ timeEl, city }) => {
        if (timeEl && city.tz) {
          timeEl.textContent = formatCityTime(city.tz);
        }
      });
    }

    requestAnimationFrame(animate);
  }

  canvas.addEventListener('pointerdown', (event) => {
    isDragging = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    canvas.style.cursor = 'grabbing';
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!isDragging) {
      return;
    }

    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;

    phi += deltaX * 0.005;
    theta = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, theta + deltaY * 0.005));

    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  });

  function stopDragging() {
    isDragging = false;
    canvas.style.cursor = 'grab';
  }

  canvas.addEventListener('pointerup', stopDragging);
  canvas.addEventListener('pointercancel', stopDragging);

  requestAnimationFrame(() => {
    createGlobeInstance();
    requestAnimationFrame(animate);
  });

  new ResizeObserver(() => {
    if (globe) {
      createGlobeInstance();
    }
  }).observe(container);
}

function boot() {
  const canvas = document.getElementById('cobe-globe-canvas');
  if (canvas) {
    initCobeGlobe(canvas);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
