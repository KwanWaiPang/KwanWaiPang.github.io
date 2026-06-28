import createGlobe from 'https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm';

const CITIES = [
  { id: 'hk', name: '香港', lat: 22.28, lng: 114.15, size: 0.09, color: [1, 0.45, 0.35] },
  { id: 'bj', name: '北京', lat: 39.9, lng: 116.4, size: 0.07, color: [1, 0.78, 0.28] },
  { id: 'sh', name: '上海', lat: 31.23, lng: 121.47, size: 0.07, color: [1, 0.92, 0.38] },
  { id: 'sf', name: '旧金山', lat: 37.78, lng: -122.44, size: 0.065, color: [0.42, 0.88, 1] },
  { id: 'ldn', name: '伦敦', lat: 51.51, lng: -0.13, size: 0.065, color: [0.52, 0.96, 0.62] },
  { id: 'tky', name: '东京', lat: 35.68, lng: 139.69, size: 0.065, color: [0.92, 0.58, 1] },
  { id: 'sg', name: '新加坡', lat: 1.35, lng: 103.82, size: 0.06, color: [0.35, 0.98, 0.78] },
];

const ARCS = [
  { from: 'hk', to: 'sf' },
  { from: 'hk', to: 'ldn' },
  { from: 'hk', to: 'tky' },
];

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

function createCityLabels(container) {
  CITIES.forEach((city) => {
    const label = document.createElement('span');
    label.className = 'cobe-city-label';
    label.dataset.city = city.id;
    label.style.positionAnchor = `--cobe-${city.id}`;
    label.style.opacity = `var(--cobe-visible-${city.id}, 0)`;
    label.textContent = city.name;
    container.appendChild(label);
  });
}

function initCobeGlobe(canvas) {
  const container = canvas.closest('.cobe-globe-wrap');
  if (!container) {
    return;
  }

  createCityLabels(container);

  const arcs = buildArcs(CITIES, ARCS);

  let phi = 0;
  let theta = 0.25;
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let globe = null;
  let resizeTimer = null;

  const DPR = 2;

  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';

  function getDimensions() {
    const display = Math.max(Math.round(container.getBoundingClientRect().width), 120);
    const px = display * DPR;

    canvas.width = px;
    canvas.height = px;
    canvas.style.width = `${display}px`;
    canvas.style.height = `${display}px`;

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
      markerElevation: 0.055,
      markers: CITIES.map((city) => ({
        id: city.id,
        location: [city.lat, city.lng],
        size: city.size,
        color: city.color,
      })),
      arcs,
      arcColor: [1, 0.86, 0.55],
      arcWidth: 0.36,
      arcHeight: 0.24,
    });
  }

  function animate() {
    if (!isDragging) {
      phi += 0.004;
    }

    if (globe) {
      globe.update({ phi, theta });
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
