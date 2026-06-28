import createGlobe from 'https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm';

const FOSHAN = { id: 'fs', name: '佛山', lat: 23.02, lng: 113.12, size: 0.085, color: [1, 0.78, 0.28] };

const VISITED = [
  { id: 'gz', name: '广州', lat: 23.13, lng: 113.26, size: 0.06, color: [1, 0.5, 0.35] },
  { id: 'sz', name: '深圳', lat: 22.54, lng: 114.06, size: 0.058, color: [1, 0.55, 0.4] },
  { id: 'hk', name: '香港', lat: 22.28, lng: 114.15, size: 0.058, color: [1, 0.42, 0.38] },
  { id: 'bj', name: '北京', lat: 39.9, lng: 116.4, size: 0.062, color: [1, 0.62, 0.22], tz: 'Asia/Shanghai' },
  { id: 'gx', name: '广西', lat: 22.82, lng: 108.37, size: 0.052, color: [0.55, 0.92, 0.55] },
  { id: 'hn', name: '湖南', lat: 28.23, lng: 112.94, size: 0.052, color: [0.95, 0.55, 0.55] },
  { id: 'sc', name: '四川', lat: 30.57, lng: 104.07, size: 0.052, color: [0.85, 0.6, 1] },
  { id: 'fj', name: '福建', lat: 26.08, lng: 119.3, size: 0.052, color: [0.5, 0.85, 0.95] },
];

const TIME_CITIES = [
  { id: 'tky', name: '东京', lat: 35.68, lng: 139.69, tz: 'Asia/Tokyo', size: 0.05, color: [0.92, 0.58, 1] },
  { id: 'nyc', name: '纽约', lat: 40.71, lng: -74.01, tz: 'America/New_York', size: 0.05, color: [0.42, 0.82, 1] },
  { id: 'par', name: '巴黎', lat: 48.86, lng: 2.35, tz: 'Europe/Paris', size: 0.048, color: [0.75, 0.65, 1] },
  { id: 'ldn', name: '伦敦', lat: 51.51, lng: -0.13, tz: 'Europe/London', size: 0.048, color: [0.52, 0.96, 0.62] },
  { id: 'sg', name: '新加坡', lat: 1.35, lng: 103.82, tz: 'Asia/Singapore', size: 0.048, color: [0.35, 0.98, 0.78] },
  { id: 'la', name: '洛杉矶', lat: 34.05, lng: -118.24, tz: 'America/Los_Angeles', size: 0.048, color: [0.35, 0.78, 1] },
  { id: 'mow', name: '莫斯科', lat: 55.75, lng: 37.62, tz: 'Europe/Moscow', size: 0.048, color: [0.55, 0.92, 0.62] },
];

function mergeMarkers() {
  const map = new Map();
  [FOSHAN, ...VISITED, ...TIME_CITIES].forEach((city) => {
    const existing = map.get(city.id);
    if (existing) {
      map.set(city.id, { ...existing, ...city, size: Math.max(existing.size, city.size) });
    } else {
      map.set(city.id, { ...city });
    }
  });
  return Array.from(map.values());
}

const MARKERS = mergeMarkers();

const ARCS = VISITED.map((city) => ({ from: FOSHAN.id, to: city.id }));

function focusOnLocation(lat, lng) {
  return {
    phi: Math.PI - (lng * Math.PI) / 180,
    theta: ((lat * Math.PI) / 180) * 0.42,
  };
}

function buildArcs(cities, arcConfig) {
  const cityMap = new Map(cities.map((city) => [city.id, [city.lat, city.lng]]));

  return arcConfig
    .map((arc) => {
      const from = cityMap.get(arc.from);
      const to = cityMap.get(arc.to);
      if (!from || !to) {
        return null;
      }
      return { from, to };
    })
    .filter(Boolean);
}

function projectMarker(lat, lng, phi, theta, size) {
  const latR = (lat * Math.PI) / 180;
  const lngR = (lng * Math.PI) / 180;

  const cosLat = Math.cos(latR);
  const sinLat = Math.sin(latR);
  const cosLng = Math.cos(lngR + phi);
  const sinLng = Math.sin(lngR + phi);

  const x = cosLat * sinLng;
  const y = sinLat;
  const z = cosLat * cosLng;

  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const yRot = y * cosT - z * sinT;
  const zRot = y * sinT + z * cosT;

  if (zRot < 0.08) {
    return null;
  }

  const radius = size / 2.25;

  return {
    x: size / 2 + x * radius,
    y: size / 2 - yRot * radius,
  };
}

function formatCityTime(timezone) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

function createCityLabels(container, cities) {
  return cities.map((city) => {
    const label = document.createElement('span');
    label.className = city.tz ? 'cobe-city-label cobe-city-label--time' : 'cobe-city-label';

    const nameEl = document.createElement('span');
    nameEl.className = 'cobe-city-label-name';
    nameEl.textContent = city.name;
    label.appendChild(nameEl);

    if (city.tz) {
      const timeEl = document.createElement('span');
      timeEl.className = 'cobe-city-label-time';
      timeEl.textContent = formatCityTime(city.tz);
      label.appendChild(timeEl);
    }

    container.appendChild(label);
    return { el: label, city, timeEl: label.querySelector('.cobe-city-label-time') };
  });
}

function updateCityLabels(labelEntries, phi, theta, displaySize) {
  labelEntries.forEach(({ el, city, timeEl }) => {
    const pos = projectMarker(city.lat, city.lng, phi, theta, displaySize);
    if (pos) {
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
      el.classList.add('is-visible');
    } else {
      el.classList.remove('is-visible');
    }

    if (timeEl && city.tz) {
      timeEl.textContent = formatCityTime(city.tz);
    }
  });
}

function initCobeGlobe(canvas) {
  const container = canvas.closest('.cobe-globe-wrap');
  if (!container) {
    return;
  }

  const focus = focusOnLocation(FOSHAN.lat, FOSHAN.lng);
  let phi = focus.phi;
  let theta = focus.theta;
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let globe = null;
  let resizeTimer = null;
  let displaySize = 0;
  let lastTimeUpdate = 0;

  const DPR = 2;
  const labelEntries = createCityLabels(container, MARKERS);
  const arcs = buildArcs(MARKERS, ARCS);

  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';

  function getDimensions() {
    displaySize = Math.max(Math.round(container.getBoundingClientRect().width), 120);
    const px = displaySize * DPR;

    canvas.width = px;
    canvas.height = px;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    return { width: px, height: px };
  }

  function createGlobeInstance() {
    if (globe) {
      globe.destroy();
    }

    const { width, height } = getDimensions();

    globe = createGlobe(canvas, {
      devicePixelRatio: DPR,
      width,
      height,
      phi,
      theta,
      dark: 0.18,
      diffuse: 2.15,
      mapSamples: 26000,
      mapBrightness: 15,
      mapBaseBrightness: 0.08,
      baseColor: [0.24, 0.7, 0.95],
      markerColor: [1, 0.72, 0.42],
      glowColor: [0.58, 0.92, 1],
      markerElevation: 0.05,
      markers: MARKERS.map((city) => ({
        id: city.id,
        location: [city.lat, city.lng],
        size: city.size,
        color: city.color,
      })),
      arcs,
      arcColor: [1, 0.86, 0.55],
      arcWidth: 0.34,
      arcHeight: 0.2,
    });
  }

  function animate(now) {
    if (!isDragging) {
      phi += 0.004;
    }

    if (globe) {
      globe.update({ phi, theta });
    }

    if (!lastTimeUpdate || now - lastTimeUpdate > 30000) {
      lastTimeUpdate = now;
      labelEntries.forEach(({ timeEl, city }) => {
        if (timeEl && city.tz) {
          timeEl.textContent = formatCityTime(city.tz);
        }
      });
    }

    updateCityLabels(labelEntries, phi, theta, displaySize);

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

  createGlobeInstance();
  requestAnimationFrame(animate);

  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(createGlobeInstance, 150);
  }).observe(container);
}

const canvas = document.getElementById('cobe-globe-canvas');
if (canvas) {
  initCobeGlobe(canvas);
}
