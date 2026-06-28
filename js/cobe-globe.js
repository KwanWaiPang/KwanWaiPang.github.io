import createGlobe from 'https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm';

const CITIES = [
  { id: 'hk', location: [22.28, 114.15], size: 0.09, color: [1, 0.38, 0.32] },
  { id: 'bj', location: [39.9, 116.4], size: 0.07, color: [1, 0.62, 0.18] },
  { id: 'sh', location: [31.23, 121.47], size: 0.07, color: [1, 0.88, 0.22] },
  { id: 'sf', location: [37.78, -122.44], size: 0.065, color: [0.35, 0.82, 1] },
  { id: 'ldn', location: [51.51, -0.13], size: 0.065, color: [0.45, 0.92, 0.55] },
  { id: 'tky', location: [35.68, 139.69], size: 0.065, color: [0.88, 0.52, 1] },
  { id: 'sg', location: [1.35, 103.82], size: 0.06, color: [0.28, 0.95, 0.72] },
];

function initCobeGlobe(canvas) {
  const container = canvas.closest('.cobe-globe-wrap');
  if (!container) {
    return;
  }

  let phi = 0;
  let theta = 0.25;
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let globe = null;
  let animationId = null;
  let resizeTimer = null;

  const DPR = 2;
  const hk = CITIES[0].location;

  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';

  container.querySelectorAll('.cobe-city-label').forEach((label) => {
    const cityId = label.dataset.city;
    if (cityId) {
      label.style.opacity = `var(--cobe-visible-${cityId}, 0)`;
    }
  });

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
      dark: 0.45,
      diffuse: 1.75,
      mapSamples: 24000,
      mapBrightness: 12,
      mapBaseBrightness: 0.03,
      baseColor: [0.08, 0.48, 0.72],
      markerColor: [1, 0.55, 0.28],
      glowColor: [0.35, 0.78, 0.98],
      markerElevation: 0.05,
      markers: CITIES.map((city) => ({
        id: city.id,
        location: city.location,
        size: city.size,
        color: city.color,
      })),
      arcs: [
        { from: hk, to: CITIES[3].location },
        { from: hk, to: CITIES[4].location },
        { from: hk, to: CITIES[5].location },
      ],
      arcColor: [1, 0.72, 0.38],
      arcWidth: 0.38,
      arcHeight: 0.26,
    });
  }

  function animate() {
    if (!isDragging) {
      phi += 0.004;
    }

    if (globe) {
      globe.update({ phi, theta });
    }

    animationId = requestAnimationFrame(animate);
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
