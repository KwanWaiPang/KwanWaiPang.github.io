import createGlobe from 'https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm';

function initCobeGlobe(canvas) {
  const container = canvas.parentElement;
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
      dark: 1,
      diffuse: 1.35,
      mapSamples: 20000,
      mapBrightness: 9,
      baseColor: [0.12, 0.18, 0.38],
      markerColor: [0.35, 0.72, 1],
      glowColor: [0.22, 0.48, 0.95],
      markers: [
        { location: [22.28, 114.15], size: 0.055 },
        { location: [39.9, 116.4], size: 0.04 },
        { location: [31.23, 121.47], size: 0.038 },
        { location: [37.78, -122.44], size: 0.032 },
        { location: [51.51, -0.13], size: 0.032 },
        { location: [35.68, 139.69], size: 0.032 },
        { location: [1.35, 103.82], size: 0.03 },
      ],
      arcs: [
        { from: [22.28, 114.15], to: [37.78, -122.44] },
        { from: [22.28, 114.15], to: [51.51, -0.13] },
        { from: [22.28, 114.15], to: [35.68, 139.69] },
      ],
      arcColor: [0.45, 0.68, 1],
      arcWidth: 0.4,
      arcHeight: 0.28,
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
