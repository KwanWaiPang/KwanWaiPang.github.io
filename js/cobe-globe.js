import createGlobe from 'https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm';

const CHINA_CENTER = { lat: 35, lng: 104 };

const WORLD_CITIES = [
  { id: 'tky', name: '东京', lat: 35.68, lng: 139.69, tz: 'Asia/Tokyo', size: 0.055, color: [0.92, 0.58, 1] },
  { id: 'del', name: '德里', lat: 28.61, lng: 77.21, tz: 'Asia/Kolkata', size: 0.045, color: [1, 0.72, 0.35] },
  { id: 'sh', name: '上海', lat: 31.23, lng: 121.47, tz: 'Asia/Shanghai', size: 0.065, color: [1, 0.92, 0.38] },
  { id: 'sao', name: '圣保罗', lat: -23.55, lng: -46.63, tz: 'America/Sao_Paulo', size: 0.045, color: [0.45, 0.95, 0.55] },
  { id: 'mex', name: '墨西哥城', lat: 19.43, lng: -99.13, tz: 'America/Mexico_City', size: 0.045, color: [0.95, 0.55, 0.45] },
  { id: 'cai', name: '开罗', lat: 30.04, lng: 31.24, tz: 'Africa/Cairo', size: 0.045, color: [1, 0.85, 0.35] },
  { id: 'bom', name: '孟买', lat: 19.08, lng: 72.88, tz: 'Asia/Kolkata', size: 0.045, color: [1, 0.6, 0.25] },
  { id: 'bj', name: '北京', lat: 39.9, lng: 116.4, tz: 'Asia/Shanghai', size: 0.075, color: [1, 0.45, 0.35] },
  { id: 'osa', name: '大阪', lat: 34.69, lng: 135.5, tz: 'Asia/Tokyo', size: 0.04, color: [0.85, 0.5, 0.95] },
  { id: 'nyc', name: '纽约', lat: 40.71, lng: -74.01, tz: 'America/New_York', size: 0.05, color: [0.42, 0.82, 1] },
  { id: 'kar', name: '卡拉奇', lat: 24.86, lng: 67.01, tz: 'Asia/Karachi', size: 0.04, color: [0.55, 0.9, 0.75] },
  { id: 'bue', name: '布宜诺斯艾利斯', lat: -34.6, lng: -58.38, tz: 'America/Argentina/Buenos_Aires', size: 0.04, color: [0.6, 0.85, 1] },
  { id: 'ist', name: '伊斯坦布尔', lat: 41.01, lng: 28.98, tz: 'Europe/Istanbul', size: 0.045, color: [0.75, 0.65, 1] },
  { id: 'kol', name: '加尔各答', lat: 22.57, lng: 88.36, tz: 'Asia/Kolkata', size: 0.04, color: [1, 0.7, 0.5] },
  { id: 'mnl', name: '马尼拉', lat: 14.6, lng: 120.98, tz: 'Asia/Manila', size: 0.04, color: [0.95, 0.45, 0.55] },
  { id: 'lag', name: '拉各斯', lat: 6.52, lng: 3.38, tz: 'Africa/Lagos', size: 0.04, color: [0.5, 0.95, 0.65] },
  { id: 'rio', name: '里约', lat: -22.91, lng: -43.17, tz: 'America/Sao_Paulo', size: 0.045, color: [0.4, 0.9, 0.6] },
  { id: 'gz', name: '广州', lat: 23.13, lng: 113.26, tz: 'Asia/Shanghai', size: 0.055, color: [1, 0.78, 0.28] },
  { id: 'la', name: '洛杉矶', lat: 34.05, lng: -118.24, tz: 'America/Los_Angeles', size: 0.05, color: [0.35, 0.78, 1] },
  { id: 'mow', name: '莫斯科', lat: 55.75, lng: 37.62, tz: 'Europe/Moscow', size: 0.05, color: [0.55, 0.92, 0.62] },
];

const ARCS = [
  { from: 'bj', to: 'nyc' },
  { from: 'bj', to: 'tky' },
  { from: 'bj', to: 'mow' },
  { from: 'sh', to: 'sao' },
  { from: 'gz', to: 'la' },
];

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
    label.className = 'cobe-city-label';
    label.textContent = city.name;
    container.appendChild(label);
    return { el: label, city };
  });
}

function createWorldClock(listEl, cities) {
  listEl.innerHTML = cities
    .map(
      (city) => `
        <li class="cobe-world-clock-item" data-tz="${city.tz}">
          <span class="cobe-world-clock-name">${city.name}</span>
          <span class="cobe-world-clock-time">--:--</span>
        </li>
      `
    )
    .join('');
}

function updateWorldClock(listEl) {
  listEl.querySelectorAll('.cobe-world-clock-item').forEach((item) => {
    const timezone = item.dataset.tz;
    const timeEl = item.querySelector('.cobe-world-clock-time');
    if (timezone && timeEl) {
      timeEl.textContent = formatCityTime(timezone);
    }
  });
}

function updateCityLabels(labelEntries, phi, theta, displaySize) {
  labelEntries.forEach(({ el, city }) => {
    const pos = projectMarker(city.lat, city.lng, phi, theta, displaySize);
    if (pos) {
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
      el.classList.add('is-visible');
    } else {
      el.classList.remove('is-visible');
    }
  });
}

function initCobeGlobe(canvas) {
  const container = canvas.closest('.cobe-globe-wrap');
  const clockList = document.getElementById('cobe-world-clock-list');
  if (!container || !clockList) {
    return;
  }

  const focus = focusOnLocation(CHINA_CENTER.lat, CHINA_CENTER.lng);
  let phi = focus.phi;
  let theta = focus.theta;
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let globe = null;
  let resizeTimer = null;
  let displaySize = 0;

  const DPR = 2;
  const labelEntries = createCityLabels(container, WORLD_CITIES);
  const arcs = buildArcs(WORLD_CITIES, ARCS);

  createWorldClock(clockList, WORLD_CITIES);
  updateWorldClock(clockList);
  setInterval(() => updateWorldClock(clockList), 30000);

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
      markers: WORLD_CITIES.map((city) => ({
        id: city.id,
        location: [city.lat, city.lng],
        size: city.size,
        color: city.color,
      })),
      arcs,
      arcColor: [1, 0.86, 0.55],
      arcWidth: 0.32,
      arcHeight: 0.22,
    });
  }

  function animate() {
    if (!isDragging) {
      phi += 0.004;
    }

    if (globe) {
      globe.update({ phi, theta });
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
  animate();

  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(createGlobeInstance, 150);
  }).observe(container);
}

const canvas = document.getElementById('cobe-globe-canvas');
if (canvas) {
  initCobeGlobe(canvas);
}
