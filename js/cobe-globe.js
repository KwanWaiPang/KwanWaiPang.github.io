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

// 到过的省份/地区；放大后显示 cities 中的具体城市（只需维护此列表）
// 北京见 TIME_CITIES；香港、澳门为省级，无下级城市
const REGIONAL = [
  {
    id: 'yn',
    name: '云南',
    lat: 25.04,
    lng: 101.55,
    size: 0.048,
    color: [0.55, 0.92, 0.58],
    cities: [
      { id: 'lj', name: '丽江', lat: 26.8558, lng: 100.2277 },
      { id: 'km', name: '昆明', lat: 25.0389, lng: 102.7183 },
    ],
  },
  {
    id: 'gx',
    name: '广西',
    lat: 24.05,
    lng: 110.65,
    size: 0.048,
    color: [0.55, 0.92, 0.55],
    cities: [
      { id: 'gl', name: '桂林', lat: 25.2736, lng: 110.29 },
      { id: 'hz', name: '贺州', lat: 24.4141, lng: 111.5665 },
      { id: 'wz', name: '梧州', lat: 23.485, lng: 111.279 },
    ],
  },
  {
    id: 'hn',
    name: '湖南',
    lat: 27.2,
    lng: 112.8,
    size: 0.048,
    color: [0.95, 0.55, 0.55],
    cities: [
      { id: 'ss', name: '韶山', lat: 27.915, lng: 112.526 },
      { id: 'xt', name: '湘潭', lat: 27.8297, lng: 112.9444 },
      { id: 'cz', name: '郴州', lat: 25.7706, lng: 113.0149 },
    ],
  },
  {
    id: 'jx',
    name: '江西',
    lat: 29.2,
    lng: 115.9,
    size: 0.048,
    color: [0.95, 0.65, 0.45],
    cities: [
      { id: 'jj', name: '九江', lat: 29.705, lng: 115.9928 },
      { id: 'nc', name: '南昌', lat: 28.682, lng: 115.8579 },
    ],
  },
  {
    id: 'fj',
    name: '福建',
    lat: 25.6,
    lng: 118.7,
    size: 0.048,
    color: [0.5, 0.85, 0.95],
    cities: [
      { id: 'np', name: '南平', lat: 26.6418, lng: 118.1777 },
      { id: 'fz', name: '福州', lat: 26.0745, lng: 119.2965 },
      { id: 'qz', name: '泉州', lat: 24.8741, lng: 118.6757 },
    ],
  },
  {
    id: 'sc',
    name: '四川',
    lat: 30.15,
    lng: 103.92,
    size: 0.048,
    color: [0.85, 0.6, 1],
    cities: [
      { id: 'cd', name: '成都', lat: 30.5728, lng: 104.0668 },
      { id: 'ls', name: '乐山', lat: 29.5521, lng: 103.7654 },
    ],
  },
  {
    id: 'gd',
    name: '广东',
    lat: 23.02,
    lng: 113.4,
    size: 0.05,
    color: [1, 0.62, 0.35],
    cities: [
      { id: 'fs', name: '佛山', lat: 23.0218, lng: 113.1219 },
      { id: 'gz', name: '广州', lat: 23.1291, lng: 113.2644 },
      { id: 'sz', name: '深圳', lat: 22.5431, lng: 114.0579 },
      { id: 'zh', name: '珠海', lat: 22.2707, lng: 113.5767 },
      { id: 'hy', name: '河源', lat: 23.7465, lng: 114.6978 },
    ],
  },
  {
    id: 'hk',
    name: '香港',
    lat: 22.3193,
    lng: 114.1694,
    size: 0.05,
    color: [1, 0.42, 0.38],
  },
  {
    id: 'mo',
    name: '澳门',
    lat: 22.1987,
    lng: 113.5439,
    size: 0.05,
    color: [1, 0.48, 0.52],
  },
];

const FOCUS = { lat: 23.02, lng: 113.12 };

const DPR = 2;
const SCALE_MIN = 1;
const SCALE_MAX = 3;
const SCALE_DEFAULT = 1;
const SCALE_CITY_THRESHOLD = 2;

const FLOAT_DURATION = 4;
const FLOAT_DELAY_STEP = 1;

const REGIONAL_FLOAT_INDEX = new Map();
let regionalFloatIndex = 0;
REGIONAL.forEach((region) => {
  region.cities?.forEach((city) => {
    REGIONAL_FLOAT_INDEX.set(city.id, regionalFloatIndex++);
  });
});

function flattenRegionalPlaces() {
  const places = [];

  REGIONAL.forEach((region) => {
    places.push({
      id: region.id,
      name: region.name,
      lat: region.lat,
      lng: region.lng,
      size: region.size,
      color: region.color,
      level: 'province',
      alwaysShow: !region.cities?.length,
    });

    region.cities?.forEach((city) => {
      places.push({
        id: city.id,
        name: city.name,
        lat: city.lat,
        lng: city.lng,
        size: region.size * 0.85,
        color: region.color,
        level: 'city',
        regionId: region.id,
      });
    });
  });

  return places;
}

const REGIONAL_PLACES = flattenRegionalPlaces();
const ALL_LABEL_PLACES = [...REGIONAL_PLACES, ...TIME_CITIES];

function rgbFromColor([r, g, b]) {
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

function isCityZoom(zoomScale) {
  return zoomScale >= SCALE_CITY_THRESHOLD;
}

function isRegionalFloatActive(zoomScale) {
  return isCityZoom(zoomScale) && zoomScale >= SCALE_MAX - 0.001;
}

function getRegionalFloatStyle(placeId) {
  const index = REGIONAL_FLOAT_INDEX.get(placeId);
  if (index === undefined) {
    return null;
  }

  return {
    delay: index * FLOAT_DELAY_STEP,
    amplitudeX: 10 + (index % 3) * 4,
    amplitudeY: 14 + (index % 4) * 2,
    duration: FLOAT_DURATION,
  };
}

function buildMarkers(scale) {
  const showCities = isCityZoom(scale);
  const markers = [];

  REGIONAL.forEach((region) => {
    const hasCities = Boolean(region.cities?.length);
    const showProvince = !hasCities || !showCities;

    markers.push({
      id: region.id,
      location: [region.lat, region.lng],
      size: showProvince ? region.size / scale : 0.001,
      color: region.color,
    });

    region.cities?.forEach((city) => {
      markers.push({
        id: city.id,
        location: [city.lat, city.lng],
        size: showCities ? (region.size * 0.85) / scale : 0.001,
        color: region.color,
      });
    });
  });

  TIME_CITIES.forEach((city) => {
    markers.push({
      id: city.id,
      location: [city.lat, city.lng],
      size: 0.001,
      color: city.color,
    });
  });

  return markers;
}

function setupRegionalLabel(label, place) {
  if (place.tz) {
    return;
  }

  label.classList.add('cobe-city-label--regional');

  if (place.level === 'province') {
    label.classList.add('cobe-city-label--province');
    if (place.alwaysShow) {
      label.classList.add('cobe-city-label--always');
    }
    return;
  }

  label.classList.add('cobe-city-label--city');

  const floatStyle = getRegionalFloatStyle(place.id);
  if (!floatStyle) {
    return;
  }

  label.style.animationDelay = `${floatStyle.delay}s`;
  label.style.setProperty('--cobe-float-duration', `${floatStyle.duration}s`);
  label.style.setProperty('--cobe-float-x', `${floatStyle.amplitudeX}px`);
  label.style.setProperty('--cobe-float-y', `${floatStyle.amplitudeY}px`);
}

function syncZoomDisplay(container, zoomScale) {
  container.classList.toggle('cobe-show-cities', isCityZoom(zoomScale));
  container.classList.toggle('cobe-regional-float-active', isRegionalFloatActive(zoomScale));
}

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

function createCityLabels(anchorRoot, places) {
  anchorRoot.querySelectorAll('.cobe-city-label, .cobe-city-star').forEach((el) => el.remove());

  return places.map((place) => {
    if (place.tz) {
      const star = document.createElement('span');
      star.className = 'cobe-city-star';
      star.style.positionAnchor = `--cobe-${place.id}`;
      star.style.setProperty('opacity', `var(--cobe-visible-${place.id}, 0)`);
      star.style.setProperty('--cobe-star-color', rgbFromColor(place.color));
      star.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.87 5.81 6.41.93-4.64 4.52 1.1 6.38L12 17.77l-5.74 3.02 1.1-6.38-4.64-4.52 6.41-.93L12 2.5z"/></svg>';
      anchorRoot.appendChild(star);
    }

    const label = document.createElement('span');
    label.className = place.tz ? 'cobe-city-label cobe-city-label--time' : 'cobe-city-label';
    label.style.positionAnchor = `--cobe-${place.id}`;
    label.style.setProperty('opacity', `var(--cobe-visible-${place.id}, 0)`);

    const nameEl = document.createElement('span');
    nameEl.className = 'cobe-city-label-name';
    nameEl.textContent = place.name;
    label.appendChild(nameEl);

    let timeEl = null;
    if (place.tz) {
      timeEl = document.createElement('span');
      timeEl.className = 'cobe-city-label-time';
      timeEl.textContent = formatCityTime(place.tz);
      label.appendChild(timeEl);
    }

    anchorRoot.appendChild(label);
    setupRegionalLabel(label, place);
    return { timeEl, place, label };
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
  let scale = SCALE_DEFAULT;

  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';

  function updateGlobeState() {
    if (globe) {
      globe.update({ phi, theta, scale, markers: buildMarkers(scale) });
    }
    syncZoomDisplay(container, scale);
  }

  function measureDisplaySize() {
    displaySize = Math.max(Math.round(container.getBoundingClientRect().width), 120);
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;
    return displaySize;
  }

  function createGlobeInstance() {
    const size = measureDisplaySize();
    const markers = buildMarkers(scale);

    if (globe) {
      globe.update({ width: size, height: size, phi, theta, scale, markers });
      syncZoomDisplay(container, scale);
      return;
    }

    globe = createGlobe(canvas, {
      devicePixelRatio: DPR,
      width: size,
      height: size,
      phi,
      theta,
      scale,
      dark: 0.38,
      diffuse: 2.3,
      mapSamples: 32000,
      mapBrightness: 20,
      mapBaseBrightness: 0.05,
      baseColor: [0.38, 0.82, 1],
      markerColor: [1, 0.72, 0.42],
      glowColor: [0.68, 0.94, 1],
      markerElevation: 0.05,
      markers,
    });

    const anchorRoot = canvas.parentElement;
    if (anchorRoot) {
      labelEntries = createCityLabels(anchorRoot, ALL_LABEL_PLACES);
      syncZoomDisplay(container, scale);
    }
  }

  function animate(now) {
    if (!isDragging) {
      phi += 0.004;
    }

    if (globe) {
      updateGlobeState();
    }

    if (!lastTimeRefresh || now - lastTimeRefresh > 30000) {
      lastTimeRefresh = now;
      labelEntries.forEach(({ timeEl, place }) => {
        if (timeEl && place.tz) {
          timeEl.textContent = formatCityTime(place.tz);
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

  canvas.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.06 : 0.06;
      scale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, scale + delta));
      updateGlobeState();
    },
    { passive: false },
  );

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
