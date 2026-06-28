import createGlobe from 'https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm';

// COBE 标记位置用 lat/lng；tz 仅用于显示当地时间（IANA 时区名，不是地理坐标）
// 北京、上海同属 UTC+8，IANA 官方名称是 Asia/Shanghai（不存在 Asia/Beijing）
const CITIES = [
  { id: 'bj', name: '北京', lat: 39.9042, lng: 116.4074, tz: 'Asia/Shanghai', size: 0.07, color: [1, 0.62, 0.22] },
  { id: 'tky', name: '东京', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo', size: 0.06, color: [0.92, 0.58, 1] },
  { id: 'nyc', name: '纽约', lat: 40.7128, lng: -74.006, tz: 'America/New_York', size: 0.06, color: [0.42, 0.82, 1] },
  { id: 'ldn', name: '伦敦', lat: 51.5074, lng: -0.1278, tz: 'Europe/London', size: 0.06, color: [0.52, 0.96, 0.62] },
  { id: 'sg', name: '新加坡', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore', size: 0.055, color: [0.35, 0.98, 0.78] },
];

const FOCUS = { lat: 35, lng: 105 };

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
    label.className = 'cobe-city-label cobe-city-label--time';
    label.style.positionAnchor = `--cobe-${city.id}`;
    label.style.setProperty('opacity', `var(--cobe-visible-${city.id}, 0)`);

    const nameEl = document.createElement('span');
    nameEl.className = 'cobe-city-label-name';
    nameEl.textContent = city.name;
    label.appendChild(nameEl);

    const timeEl = document.createElement('span');
    timeEl.className = 'cobe-city-label-time';
    timeEl.textContent = formatCityTime(city.tz);
    label.appendChild(timeEl);

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

    if (globe) {
      globe.update({ width: size, height: size, phi, theta });
      return;
    }

    globe = createGlobe(canvas, {
      devicePixelRatio: DPR,
      width: size,
      height: size,
      phi,
      theta,
      dark: 0.5,
      diffuse: 1.8,
      mapSamples: 24000,
      mapBrightness: 11,
      mapBaseBrightness: 0.04,
      baseColor: [0.1, 0.52, 0.78],
      markerColor: [1, 0.72, 0.42],
      glowColor: [0.38, 0.8, 0.98],
      markerElevation: 0.05,
      markers: CITIES.map((city) => ({
        id: city.id,
        location: [city.lat, city.lng],
        size: city.size,
        color: city.color,
      })),
    });

    const anchorRoot = canvas.parentElement;
    if (anchorRoot) {
      labelEntries = createCityLabels(anchorRoot, CITIES);
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
        timeEl.textContent = formatCityTime(city.tz);
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
