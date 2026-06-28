(function () {
  'use strict';

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

  // 去过的城市（只需维护此列表）
  const VISITED = [
    // 云南
    { id: 'lj', name: '丽江', lat: 26.8558, lng: 100.2277, color: [0.55, 0.92, 0.58] },
    { id: 'km', name: '昆明', lat: 25.0389, lng: 102.7183, color: [0.55, 0.92, 0.58] },
    // 广西
    { id: 'gl', name: '桂林', lat: 25.2736, lng: 110.29, color: [0.55, 0.92, 0.55] },
    { id: 'hz', name: '贺州', lat: 24.4141, lng: 111.5665, color: [0.55, 0.92, 0.55] },
    { id: 'wz', name: '梧州', lat: 23.485, lng: 111.279, color: [0.55, 0.92, 0.55] },
    // 湖南
    { id: 'ss', name: '韶山', lat: 27.915, lng: 112.526, color: [0.95, 0.55, 0.55] },
    { id: 'xt', name: '湘潭', lat: 27.8297, lng: 112.9444, color: [0.95, 0.55, 0.55] },
    { id: 'cz', name: '郴州', lat: 25.7706, lng: 113.0149, color: [0.95, 0.55, 0.55] },
    // 江西
    { id: 'jj', name: '九江', lat: 29.705, lng: 115.9928, color: [0.95, 0.65, 0.45] },
    { id: 'nc', name: '南昌', lat: 28.682, lng: 115.8579, color: [0.95, 0.65, 0.45] },
    // 福建
    { id: 'np', name: '南平', lat: 26.6418, lng: 118.1777, color: [0.5, 0.85, 0.95] },
    { id: 'fz', name: '福州', lat: 26.0745, lng: 119.2965, color: [0.5, 0.85, 0.95] },
    { id: 'qz', name: '泉州', lat: 24.8741, lng: 118.6757, color: [0.5, 0.85, 0.95] },
    // 四川
    { id: 'cd', name: '成都', lat: 30.5728, lng: 104.0668, color: [0.85, 0.6, 1] },
    { id: 'ls', name: '乐山', lat: 29.5521, lng: 103.7654, color: [0.85, 0.6, 1] },
    // 广东
    { id: 'fs', name: '佛山', lat: 23.0218, lng: 113.1219, color: [1, 0.62, 0.35] },
    { id: 'gz', name: '广州', lat: 23.1291, lng: 113.2644, color: [1, 0.62, 0.35] },
    { id: 'sz', name: '深圳', lat: 22.5431, lng: 114.0579, color: [1, 0.62, 0.35] },
    { id: 'zh', name: '珠海', lat: 22.2707, lng: 113.5767, color: [1, 0.62, 0.35] },
    { id: 'hy', name: '河源', lat: 23.7465, lng: 114.6978, color: [1, 0.62, 0.35] },
    // 北京
    { id: 'bj', name: '北京', lat: 39.9042, lng: 116.4074, color: [1, 0.62, 0.22], tz: 'Asia/Shanghai' },
    // 香港
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
    // 澳门
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

  // globe.gl 缩放（与之前 COBE/globe 阶段一致）
  // altitude 越大越远（地球越小），越小越近（地球越大）
  const ZOOM = {
    initialAltitude: 2.2, // 原始视图
    maxMagnification: 6,  // 最多放大 6 倍（相对 initialAltitude）
    speed: 0.3,
  };

  function getZoomAltitudeLimits() {
    const maxAlt = ZOOM.initialAltitude;
    // 与之前 3 倍时 minAltitude=0.55 同一线性比例，外推到 maxMagnification
    const minAt3x = 0.55;
    const step = (maxAlt - minAt3x) / (3 - 1);
    const minAlt = Math.max(0.01, maxAlt - (ZOOM.maxMagnification - 1) * step);
    return { minAlt, maxAlt };
  }

  function distanceFromAltitude(altitude, globeRadius) {
    return globeRadius * (1 + altitude);
  }

  const GLOBE_TEXTURE =
    '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg';
  const BUMP_TEXTURE =
    '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png';
  const CLOUDS_TEXTURE =
    '//cdn.jsdelivr.net/gh/vasturiano/globe.gl@master/example/clouds/clouds.png';
  const CLOUDS_ALT = 0.004;
  const CLOUDS_ROTATION_SPEED = -0.006;

  function markerLocation(place) {
    return { lat: place.markerLat ?? place.lat, lng: place.markerLng ?? place.lng };
  }

  function getVisitedPlaces() {
    return VISITED.map((place) => {
      const { lat, lng } = markerLocation(place);
      return { ...place, lat, lng };
    });
  }

  function getLabelPlaces() {
    return [...getVisitedPlaces(), ...TIME_CITIES];
  }

  const VISITED_PLACES = getVisitedPlaces();
  const LABEL_PLACES = getLabelPlaces();

  function rgbFromColor([r, g, b]) {
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  }

  function findGlobeMesh(scene) {
    let mesh = null;
    scene.traverse((obj) => {
      if (!mesh && obj.isMesh && obj.material && obj.material.map && obj.geometry) {
        mesh = obj;
      }
    });
    return mesh;
  }

  function addCloudLayer(globe) {
    try {
      const scene = globe.scene();
      const globeMesh = findGlobeMesh(scene);
      if (!globeMesh) {
        return;
      }

      const { constructor: SphereGeometry } = globeMesh.geometry;
      const { constructor: Mesh } = globeMesh;
      const { constructor: MeshPhongMaterial } = globeMesh.material;
      const { constructor: Texture } = globeMesh.material.map;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const cloudsTexture = new Texture(img);
        cloudsTexture.needsUpdate = true;

        const clouds = new Mesh(
          new SphereGeometry(globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
          new MeshPhongMaterial({ map: cloudsTexture, transparent: true, opacity: 0.4 }),
        );
        scene.add(clouds);

        (function rotateClouds() {
          clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
          requestAnimationFrame(rotateClouds);
        })();
      };
      img.onerror = () => {};
      img.src = CLOUDS_TEXTURE.startsWith('//') ? `https:${CLOUDS_TEXTURE}` : CLOUDS_TEXTURE;
    } catch (error) {
      console.warn('[globe-gl] cloud layer skipped:', error);
    }
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

  function createLabelElement(place) {
    const anchor = document.createElement('div');
    anchor.className = 'cobe-city-label-anchor';

    const el = document.createElement('div');
    el.dataset.placeId = place.id;
    el.className = 'cobe-city-label';

    if (place.tz) {
      el.classList.add('cobe-city-label--time');
    }

    if (place.labelOffset) {
      el.classList.add('cobe-city-label--offset');
      el.style.setProperty('--cobe-label-x', `${place.labelOffset.x}px`);
      el.style.setProperty('--cobe-label-y', `${place.labelOffset.y}px`);
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

    anchor.appendChild(el);
    return anchor;
  }

  function refreshTimes(container) {
    const timeLookup = new Map();
    LABEL_PLACES.forEach((place) => {
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

  function applyPlaces(globe) {
    globe
      .htmlElementsData(LABEL_PLACES)
      .pointsData(
        VISITED_PLACES.map((place) => ({
          lat: place.lat,
          lng: place.lng,
          color: rgbFromColor(place.color),
        })),
      );
  }

  function initGlobe(container) {
    let globe = null;

    function measureSize() {
      return Math.max(Math.round(container.getBoundingClientRect().width), 120);
    }

    function initGlobeInstance() {
      const size = measureSize();

      if (globe) {
        globe.width(size).height(size);
        applyPlaces(globe);
        return;
      }

      globe = new Globe(container, { animateIn: false })
        .width(size)
        .height(size)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl(GLOBE_TEXTURE)
        .bumpImageUrl(BUMP_TEXTURE)
        .showAtmosphere(true)
        .atmosphereColor('lightskyblue')
        .atmosphereAltitude(0.18)
        .pointAltitude(0)
        .pointColor('color')
        .pointRadius(0.14)
        .pointsMerge(true)
        .htmlLat('lat')
        .htmlLng('lng')
        .htmlAltitude(0.015)
        .htmlElement((place) => createLabelElement(place))
        .htmlTransitionDuration(0)
        .onGlobeReady(() => addCloudLayer(globe));

      const controls = globe.controls();
      const globeRadius = globe.getGlobeRadius();
      const { minAlt, maxAlt } = getZoomAltitudeLimits();

      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableZoom = true;
      controls.zoomSpeed = ZOOM.speed;
      controls.minDistance = distanceFromAltitude(minAlt, globeRadius);
      controls.maxDistance = distanceFromAltitude(maxAlt, globeRadius);

      globe.pointOfView({ lat: FOCUS.lat, lng: FOCUS.lng, altitude: maxAlt }, 0);

      applyPlaces(globe);

      setInterval(() => refreshTimes(container), 30000);
    }

    initGlobeInstance();

    requestAnimationFrame(() => {
      if (globe && measureSize() > 0) {
        initGlobeInstance();
      }
    });

    new ResizeObserver(() => {
      if (globe) {
        initGlobeInstance();
      }
    }).observe(container);
  }

  function boot() {
    const container = document.getElementById('globe-root');
    if (!container) {
      return;
    }

    if (typeof Globe === 'undefined') {
      console.error('[globe-gl] Globe is not loaded. Check CDN script.');
      return;
    }

    try {
      initGlobe(container);
    } catch (error) {
      console.error('[globe-gl] init failed:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
