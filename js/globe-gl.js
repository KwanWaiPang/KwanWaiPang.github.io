import Globe from 'https://esm.sh/globe.gl@2.43.0';

// 带时间的国际城市（tz 为 IANA 时区名）
const TIME_CITIES = [
  { id: 'tky', name: 'Tokyo', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo', color: [0.92, 0.58, 1] },
  { id: 'nyc', name: 'New York', lat: 40.7128, lng: -74.006, tz: 'America/New_York', color: [0.42, 0.82, 1] },
  { id: 'ldn', name: 'London', lat: 51.5074, lng: -0.1278, tz: 'Europe/London', color: [0.52, 0.96, 0.62] },
  { id: 'sg', name: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore', color: [0.35, 0.98, 0.78] },
  { id: 'la', name: 'Los Angeles', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles', color: [0.35, 0.78, 1] },
  { id: 'par', name: 'Paris', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris', color: [0.75, 0.65, 1] },
  { id: 'mow', name: 'Moscow', lat: 55.7558, lng: 37.6173, tz: 'Europe/Moscow', color: [0.55, 0.92, 0.62] },
  { id: 'cbr', name: 'Canberra', lat: -35.2809, lng: 149.13, tz: 'Australia/Canberra', color: [0.95, 0.55, 0.45] },
];

// 到过的省份/地区；放大后显示 cities 中的具体城市（只需维护此列表）
const REGIONAL = [
  {
    id: 'yn',
    name: '云南',
    lat: 25.04,
    lng: 101.55,
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
    id: 'bj',
    name: '北京',
    lat: 39.9042,
    lng: 116.4074,
    color: [1, 0.62, 0.22],
    tz: 'Asia/Shanghai',
  },
  {
    id: 'hk',
    name: '香港',
    lat: 22.3193,
    lng: 114.1694,
    markerLat: 22.26,
    markerLng: 114.08,
    labelOffset: { x: -26, y: 18 },
    color: [1, 0.42, 0.38],
  },
  {
    id: 'mo',
    name: '澳门',
    lat: 22.1987,
    lng: 113.5439,
    markerLat: 22.14,
    markerLng: 113.62,
    labelOffset: { x: 26, y: 18 },
    color: [1, 0.48, 0.52],
  },
];

const FOCUS = { lat: 23.02, lng: 113.12 };

const SCALE_MIN = 1;
const SCALE_MAX = 3;
const SCALE_CITY_THRESHOLD = 2;
const SCALE_FLOAT_THRESHOLD = 3;
const ALTITUDE_MAX = 2.2;
const ALTITUDE_MIN = 0.55;

const FLOAT_DURATION = 4;
const FLOAT_DELAY_STEP = 1;

const REGIONAL_FLOAT_INDEX = new Map();
let regionalFloatIndex = 0;
REGIONAL.forEach((region) => {
  region.cities?.forEach((city) => {
    REGIONAL_FLOAT_INDEX.set(city.id, regionalFloatIndex++);
  });
});

const GLOBE_TEXTURE =
  'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg';

function rgbFromColor([r, g, b]) {
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

function regionMarkerLocation(region) {
  return { lat: region.markerLat ?? region.lat, lng: region.markerLng ?? region.lng };
}

function flattenRegionalPlaces() {
  const places = [];

  REGIONAL.forEach((region) => {
    const { lat, lng } = regionMarkerLocation(region);

    places.push({
      id: region.id,
      name: region.name,
      lat,
      lng,
      color: region.color,
      level: 'province',
      alwaysShow: !region.cities?.length,
      labelOffset: region.labelOffset,
      tz: region.tz,
    });

    region.cities?.forEach((city) => {
      places.push({
        id: city.id,
        name: city.name,
        lat: city.lat,
        lng: city.lng,
        color: region.color,
        level: 'city',
        regionId: region.id,
      });
    });
  });

  return places;
}

const REGIONAL_PLACES = flattenRegionalPlaces();

function scaleToAltitude(scale) {
  return ALTITUDE_MAX - (scale - SCALE_MIN) * ((ALTITUDE_MAX - ALTITUDE_MIN) / (SCALE_MAX - SCALE_MIN));
}

function altitudeToScale(altitude) {
  return SCALE_MIN + ((ALTITUDE_MAX - altitude) / (ALTITUDE_MAX - ALTITUDE_MIN)) * (SCALE_MAX - SCALE_MIN);
}

function clampScale(scale) {
  return Math.max(SCALE_MIN, Math.min(SCALE_MAX, scale));
}

function isCityZoom(scale) {
  return scale >= SCALE_CITY_THRESHOLD;
}

function isRegionalFloatActive(scale) {
  return scale >= SCALE_FLOAT_THRESHOLD - 0.001;
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

function getVisiblePlaces(scale) {
  const showCities = isCityZoom(scale);
  const places = [];

  REGIONAL.forEach((region) => {
    const hasCities = Boolean(region.cities?.length);
    const { lat, lng } = regionMarkerLocation(region);

    if (!hasCities || !showCities) {
      places.push({
        id: region.id,
        name: region.name,
        lat,
        lng,
        color: region.color,
        level: 'province',
        alwaysShow: !hasCities,
        labelOffset: region.labelOffset,
        tz: region.tz,
        pointRadius: 0.22,
      });
    }

    if (hasCities && showCities) {
      region.cities.forEach((city) => {
        places.push({
          id: city.id,
          name: city.name,
          lat: city.lat,
          lng: city.lng,
          color: region.color,
          level: 'city',
          regionId: region.id,
          pointRadius: 0.18,
        });
      });
    }
  });

  TIME_CITIES.forEach((city) => {
    places.push({
      ...city,
      level: 'intl',
      pointRadius: 0.2,
    });
  });

  return places;
}

function createLabelElement(place) {
  const el = document.createElement('div');
  el.dataset.placeId = place.id;
  el.className = 'cobe-city-label';

  if (place.tz) {
    el.classList.add('cobe-city-label--time');
    if (place.level === 'intl') {
      el.classList.add('cobe-city-label--intl');
    }
  }

  if (place.level === 'province' || place.level === 'city') {
    el.classList.add('cobe-city-label--regional');
  }

  if (place.level === 'province') {
    el.classList.add('cobe-city-label--province');
    if (place.alwaysShow) {
      el.classList.add('cobe-city-label--always');
    }
  }

  if (place.level === 'city') {
    el.classList.add('cobe-city-label--city');
    const floatStyle = getRegionalFloatStyle(place.id);
    if (floatStyle) {
      el.style.animationDelay = `${floatStyle.delay}s`;
      el.style.setProperty('--cobe-float-duration', `${floatStyle.duration}s`);
      el.style.setProperty('--cobe-float-x', `${floatStyle.amplitudeX}px`);
      el.style.setProperty('--cobe-float-y', `${floatStyle.amplitudeY}px`);
    }
  }

  if (place.labelOffset) {
    el.classList.add('cobe-city-label--offset');
    el.style.setProperty('--cobe-label-x', `${place.labelOffset.x}px`);
    el.style.setProperty('--cobe-label-y', `${place.labelOffset.y}px`);
  }

  if (place.tz && place.level === 'intl') {
    const star = document.createElement('span');
    star.className = 'cobe-city-label-star';
    star.style.color = rgbFromColor(place.color);
    star.textContent = '★';
    el.appendChild(star);
  }

  const nameEl = document.createElement('span');
  nameEl.className = 'cobe-city-label-name';
  nameEl.textContent = place.name;
  el.appendChild(nameEl);

  if (place.tz) {
    const timeEl = document.createElement('span');
    timeEl.className = 'cobe-city-label-time';
    timeEl.textContent = formatCityTime(place.tz);
    el.appendChild(timeEl);
  }

  return el;
}

function refreshTimes(container) {
  const timeLookup = new Map();
  [...REGIONAL_PLACES, ...TIME_CITIES].forEach((place) => {
    if (place.tz) {
      timeLookup.set(place.id, place.tz);
    }
  });

  container.querySelectorAll('.cobe-city-label-time').forEach((timeEl) => {
    const placeId = timeEl.closest('[data-place-id]')?.dataset.placeId;
    const tz = timeLookup.get(placeId);
    if (tz) {
      timeEl.textContent = formatCityTime(tz);
    }
  });
}

function syncZoomDisplay(container, scale) {
  container.classList.toggle('cobe-show-cities', isCityZoom(scale));
  container.classList.toggle('cobe-regional-float-active', isRegionalFloatActive(scale));
}

function initGlobe(container) {
  let currentScale = SCALE_MIN;
  let globe = null;

  function measureSize() {
    return Math.max(Math.round(container.getBoundingClientRect().width), 120);
  }

  function applyVisiblePlaces(scale) {
    currentScale = clampScale(scale);
    const places = getVisiblePlaces(currentScale);

    globe
      .htmlElementsData(places)
      .pointsData(
        places.map((place) => ({
          lat: place.lat,
          lng: place.lng,
          color: rgbFromColor(place.color),
          radius: place.pointRadius ?? 0.2,
        })),
      );

    syncZoomDisplay(container, currentScale);
  }

  function setScale(scale) {
    const nextScale = clampScale(scale);
    globe.pointOfView({ altitude: scaleToAltitude(nextScale) }, 200);
    applyVisiblePlaces(nextScale);
  }

  function initGlobeInstance() {
    const size = measureSize();

    if (globe) {
      globe.width(size).height(size);
      applyVisiblePlaces(currentScale);
      return;
    }

    globe = Globe(container)
      .width(size)
      .height(size)
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl(GLOBE_TEXTURE)
      .showAtmosphere(true)
      .atmosphereColor('rgba(120, 200, 255, 0.55)')
      .atmosphereAltitude(0.12)
      .pointAltitude(0.01)
      .pointColor('color')
      .pointRadius('radius')
      .htmlLat('lat')
      .htmlLng('lng')
      .htmlAltitude(0.015)
      .htmlElement(createLabelElement)
      .htmlTransitionDuration(200);

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.controls().enableZoom = false;

    globe.pointOfView({ lat: FOCUS.lat, lng: FOCUS.lng, altitude: scaleToAltitude(SCALE_MIN) }, 0);

    globe.controls().addEventListener('change', () => {
      const pov = globe.pointOfView();
      const clampedAlt = Math.max(ALTITUDE_MIN, Math.min(ALTITUDE_MAX, pov.altitude));
      if (Math.abs(clampedAlt - pov.altitude) > 0.001) {
        globe.pointOfView({ altitude: clampedAlt }, 0);
      }

      const scale = clampScale(altitudeToScale(clampedAlt));
      if (Math.abs(scale - currentScale) > 0.04) {
        applyVisiblePlaces(scale);
      }
    });

    container.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? -0.12 : 0.12;
        setScale(currentScale + delta);
      },
      { passive: false },
    );

    applyVisiblePlaces(SCALE_MIN);

    setInterval(() => refreshTimes(container), 30000);
  }

  initGlobeInstance();

  new ResizeObserver(() => {
    if (globe) {
      initGlobeInstance();
    }
  }).observe(container);
}

function boot() {
  const container = document.getElementById('globe-root');
  if (container) {
    initGlobe(container);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
