/* A small, isolated portrait of the existing rounded Spectrum bee. */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const instances = new WeakMap();
const noop = Object.freeze({ start() {}, stop() {}, dispose() {} });

export function createWelcomeBee(canvas) {
  if (!canvas || typeof canvas.getContext !== "function") return noop;
  if (instances.has(canvas)) return instances.get(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    return noop;
  }

  canvas.setAttribute("aria-hidden", "true");
  canvas.style.pointerEvents = "none";
  canvas.classList.remove("is-ready");
  const events = new AbortController();
  const signal = events.signal;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 30);
  const bee = new THREE.Group();
  const wings = [];
  let environmentTarget;
  let resizeObserver;
  let frame = 0;
  let running = false;
  let resumeAfterRestore = false;
  let disposed = false;
  let elapsed = 0;
  let lastPaint = 0;
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  scene.add(bee);

  /* Materials and anatomy are copied unchanged from the current Spectrum bee. */
  const gold = new THREE.MeshStandardMaterial({ color: "#ffc632", roughness: 0.3, metalness: 0.12 });
  const honey = new THREE.MeshStandardMaterial({ color: "#e9a51b", roughness: 0.35, metalness: 0.16 });
  const ink = new THREE.MeshStandardMaterial({ color: "#16283d", roughness: 0.28, metalness: 0.12 });
  const white = new THREE.MeshStandardMaterial({ color: "#fffdf4", roughness: 0.3 });
  const cream = new THREE.MeshStandardMaterial({ color: "#eee6d3", roughness: 0.46, metalness: 0.05 });
  const wingMaterial = new THREE.MeshPhysicalMaterial({
    color: "#a7def5", transparent: true, opacity: 0.65, roughness: 0.16,
    metalness: 0.06, clearcoat: 0.8, clearcoatRoughness: 0.22, depthWrite: false
  });
  const veinMaterial = new THREE.MeshStandardMaterial({ color: "#e1f5ff", roughness: 0.35, transparent: true, opacity: 0.8 });
  const ballGeometry = new THREE.SphereGeometry(1, 28, 20);

  function ball(parent, material, position, scale) {
    const mesh = new THREE.Mesh(ballGeometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }

  function tube(parent, points, radius, material) {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 22, radius, 7, false), material);
    parent.add(mesh);
    return mesh;
  }

  function box(parent, material, position, scale) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...scale), material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }

  ball(bee, gold, [0, -0.3, 0], [0.76, 0.94, 0.61]);
  [-0.85, -0.45, -0.05].forEach((y) => {
    const radius = 0.76 * Math.sqrt(1 - ((y + 0.3) / 0.94) ** 2);
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.085, 9, 44), ink);
    stripe.rotation.x = Math.PI / 2;
    stripe.scale.y = 0.8;
    stripe.position.y = y;
    bee.add(stripe);
  });
  ball(bee, gold, [0, 0.88, 0.12], [0.79, 0.73, 0.66]);
  ball(bee, honey, [-0.48, 0.68, 0.62], [0.15, 0.105, 0.07]);
  ball(bee, honey, [0.48, 0.68, 0.62], [0.15, 0.105, 0.07]);
  [-1, 1].forEach((sign) => {
    ball(bee, white, [sign * 0.28, 1.02, 0.69], [0.225, 0.275, 0.1]);
    ball(bee, ink, [sign * 0.255, 1.015, 0.785], [0.108, 0.145, 0.055]);
    ball(bee, white, [sign * 0.255 - 0.028, 1.065, 0.829], [0.035, 0.042, 0.017]);
    tube(bee, [[sign * 0.12, 1.34, 0.63], [sign * 0.28, 1.4, 0.66], [sign * 0.43, 1.35, 0.61]], 0.024, ink);
    tube(bee, [[sign * 0.28, 1.5, 0.1], [sign * 0.32, 1.8, 0.07], [sign * 0.47, 1.99, 0.09]], 0.028, ink);
    ball(bee, honey, [sign * 0.47, 1.99, 0.09], [0.075, 0.075, 0.075]);
    tube(bee, [[sign * 0.53, 0.06, 0.07], [sign * 0.86, -0.08, 0.39], [sign * 0.94, -0.44, 0.64]], 0.065, ink);
    ball(bee, gold, [sign * 0.94, -0.44, 0.64], [0.145, 0.15, 0.13]);
    tube(bee, [[sign * 0.26, -1.02, 0.1], [sign * 0.28, -1.3, 0.16], [sign * 0.34, -1.39, 0.2]], 0.06, ink);
    ball(bee, ink, [sign * 0.34, -1.4, 0.25], [0.23, 0.13, 0.32]);

    const pivot = new THREE.Group();
    pivot.position.set(sign * 0.4, 0.28, -0.4);
    pivot.rotation.z = -sign * 0.48;
    const wing = ball(pivot, wingMaterial, [sign * 0.3, 0.64, 0], [0.5, 0.9, 0.075]);
    wing.renderOrder = 1;
    tube(pivot, [[sign * 0.04, 0.12, 0.08], [sign * 0.3, 0.62, 0.08], [sign * 0.4, 1.34, 0.01]], 0.012, veinMaterial);
    tube(pivot, [[sign * 0.04, 0.12, 0.08], [sign * 0.48, 0.48, 0.08], [sign * 0.65, 0.9, 0.01]], 0.01, veinMaterial);
    wings.push({ pivot, sign });
    bee.add(pivot);
  });
  tube(bee, [[-0.2, 0.65, 0.735], [0, 0.57, 0.77], [0.2, 0.65, 0.735]], 0.022, ink);

  const clapper = new THREE.Group();
  clapper.position.set(-0.77, -0.83, 0.8);
  clapper.rotation.z = -0.18;
  clapper.scale.setScalar(0.78);
  box(clapper, ink, [0, 0, 0], [1.03, 0.65, 0.12]);
  box(clapper, cream, [0, 0.12, 0.068], [0.77, 0.025, 0.015]);
  box(clapper, cream, [0, -0.04, 0.068], [0.77, 0.018, 0.015]);
  box(clapper, cream, [0, -0.2, 0.068], [0.77, 0.018, 0.015]);
  const clapperBar = new THREE.Group();
  clapperBar.position.set(-0.02, 0.43, 0.01);
  clapperBar.rotation.z = 0.16;
  box(clapperBar, ink, [0, 0, 0], [1.1, 0.18, 0.14]);
  for (let i = 0; i < 6; i++) {
    const stripe = box(clapperBar, white, [-0.44 + i * 0.176, 0, 0.078], [0.09, 0.155, 0.014]);
    stripe.rotation.z = -0.38;
  }
  bee.add(clapper);

  const hemisphere = new THREE.HemisphereLight(0xfff9e8, 0x9bafc4, 2.0);
  scene.add(hemisphere);
  const key = new THREE.DirectionalLight(0xfff5dc, 3.1);
  key.position.set(-3, 6, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc4e8ff, 2.0);
  rim.position.set(4, 2, -3);
  scene.add(rim);
  try {
    const environment = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(renderer);
    environmentTarget = generator.fromScene(environment, 0.04);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 0.65;
    environment.dispose();
    generator.dispose();
  } catch { /* The same direct lights provide a complete portrait without reflections. */ }

  function pose() {
    bee.rotation.set(0, -0.24, -0.035);
    bee.position.y = Math.sin(elapsed * 1.7) * 0.035;
    wings.forEach(({ pivot, sign }) => {
      pivot.rotation.y = sign * (0.25 + Math.sin(elapsed * 12) * 0.18);
      pivot.rotation.z = -sign * (0.48 + Math.sin(elapsed * 12) * 0.025);
    });
  }

  function resize() {
    if (disposed || !running) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width || canvas.clientWidth || 150);
    const height = Math.max(1, rect.height || canvas.clientHeight || 190);
    const aspect = width / height;
    pose();
    const bounds = new THREE.Box3().setFromObject(bee);
    bounds.getCenter(center);
    bounds.getSize(size);
    const halfHeight = Math.max(size.y / 2 + 0.16, (size.x / 2 + 0.12) / aspect);
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.position.set(center.x, center.y, 8);
    camera.lookAt(center.x, center.y, 0);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
  }

  function requestRender() {
    if (running && !disposed && !document.hidden && !frame) frame = window.requestAnimationFrame(paint);
  }

  function paint(timestamp, force = false) {
    frame = 0;
    if (!running || disposed || document.hidden) return;
    if (!force && !media.matches && lastPaint && timestamp - lastPaint < 1000 / 24) {
      requestRender();
      return;
    }
    if (!media.matches && lastPaint) elapsed += Math.min((timestamp - lastPaint) / 1000, 0.08);
    lastPaint = timestamp;
    try {
      pose();
      renderer.render(scene, camera);
      if (renderer.getContext().isContextLost()) throw new Error("Context lost");
      if (renderer.info.render.calls > 0) canvas.classList.add("is-ready");
    } catch {
      dispose();
      return;
    }
    if (!media.matches) requestRender();
  }

  function start() {
    if (disposed || running) return;
    running = true;
    lastPaint = 0;
    resize();
    paint(window.performance.now(), true);
  }

  function stop() {
    running = false;
    resumeAfterRestore = false;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastPaint = 0;
  }

  function dispose() {
    if (disposed) return;
    stop();
    disposed = true;
    events.abort();
    resizeObserver?.disconnect();
    const geometries = new Set();
    const materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => materials.add(material));
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    environmentTarget?.dispose();
    renderer.dispose();
    canvas.classList.remove("is-ready");
    instances.delete(canvas);
  }

  function refresh() {
    if (!running || disposed) return;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastPaint = 0;
    if (!document.hidden) {
      resize();
      paint(window.performance.now(), true);
    }
  }

  document.addEventListener("visibilitychange", refresh, { signal });
  media.addEventListener("change", refresh, { signal });
  window.addEventListener("resize", refresh, { passive: true, signal });
  canvas.addEventListener("webglcontextlost", (event) => { event.preventDefault(); dispose(); }, { signal });
  if (typeof ResizeObserver === "function") {
    resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(canvas);
  }
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) {
      const wasRunning = running;
      stop();
      resumeAfterRestore = wasRunning;
    } else dispose();
  }, { signal });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && resumeAfterRestore) {
      resumeAfterRestore = false;
      start();
    }
  }, { signal });
  const api = Object.freeze({ start, stop, dispose });
  instances.set(canvas, api);
  return api;
}
