/* The existing rounded Mr. Bee, with a direct gaze and three expressive poses. */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const instances = new WeakMap();
const noop = Object.freeze({ start() {}, stop() {}, dispose() {}, setMood() {} });

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
  const head = new THREE.Group();
  const wings = [];
  const eyes = [];
  const brows = [];
  const arms = [];
  const legs = [];
  const antennae = [];
  const mouths = [];
  let environmentTarget;
  let resizeObserver;
  let frame = 0;
  let running = false;
  let resumeAfterRestore = false;
  let disposed = false;
  let elapsed = 0;
  let lastPaint = 0;
  let mood = "neutral";
  let expression = { excited: 0, sad: 0 };
  let transition = null;
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  const portraitBounds = new THREE.Box3();

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

  function expressiveTube(parent, neutral, excited, sad, radius, material) {
    const make = points => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point))), 22, radius, 7, false);
    const geometry = make(neutral);
    const variants = [make(excited), make(sad)];
    geometry.morphAttributes.position = variants.map(variant => variant.attributes.position.clone());
    geometry.morphAttributes.normal = variants.map(variant => variant.attributes.normal.clone());
    variants.forEach(variant => variant.dispose());
    const mesh = new THREE.Mesh(geometry, material);
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
  head.position.set(0, 0.88, 0.12);
  bee.add(head);
  const facePoint = ([x, y, z]) => [x, y - 0.88, z - 0.12];
  ball(head, gold, [0, 0, 0], [0.79, 0.73, 0.66]);
  ball(head, honey, facePoint([-0.48, 0.68, 0.62]), [0.15, 0.105, 0.07]);
  ball(head, honey, facePoint([0.48, 0.68, 0.62]), [0.15, 0.105, 0.07]);
  [-1, 1].forEach((sign) => {
    const eye = ball(head, white, facePoint([sign * 0.28, 1.02, 0.69]), [0.225, 0.275, 0.1]);
    const pupil = ball(head, ink, facePoint([sign * 0.28, 1.02, 0.785]), [0.108, 0.145, 0.055]);
    const glint = ball(head, white, facePoint([sign * 0.28 - 0.028, 1.07, 0.829]), [0.035, 0.042, 0.017]);
    eyes.push({ eye, pupil, glint });
    const brow = expressiveTube(head,
      [[sign * 0.12, 1.34, 0.63], [sign * 0.28, 1.4, 0.66], [sign * 0.43, 1.35, 0.61]].map(facePoint),
      [[sign * 0.12, 1.45, 0.63], [sign * 0.28, 1.51, 0.66], [sign * 0.43, 1.46, 0.61]].map(facePoint),
      [[sign * 0.12, 1.47, 0.63], [sign * 0.28, 1.4, 0.66], [sign * 0.43, 1.29, 0.61]].map(facePoint), 0.024, ink);
    brows.push(brow);
    const antenna = new THREE.Group();
    antenna.position.set(...facePoint([sign * 0.28, 1.5, 0.1]));
    tube(antenna, [[0, 0, 0], [sign * 0.04, 0.3, -0.03], [sign * 0.19, 0.49, -0.01]], 0.028, ink);
    ball(antenna, honey, [sign * 0.19, 0.49, -0.01], [0.075, 0.075, 0.075]);
    head.add(antenna);
    antennae.push({ antenna, sign });
    const arm = new THREE.Group();
    arm.position.set(sign * 0.53, 0.06, 0.07);
    tube(arm, [[0, 0, 0], [sign * 0.33, -0.14, 0.32], [sign * 0.41, -0.5, 0.57]], 0.065, ink);
    ball(arm, gold, [sign * 0.41, -0.5, 0.57], [0.145, 0.15, 0.13]);
    bee.add(arm);
    arms.push({ arm, sign });
    const leg = new THREE.Group();
    leg.position.set(sign * 0.26, -1.02, 0.1);
    const shin = expressiveTube(leg,
      [[0, 0, 0], [sign * 0.02, -0.28, 0.06], [sign * 0.08, -0.37, 0.1]],
      [[0, 0, 0], [sign * 0.02, -0.25, 0.06], [sign * 0.08, -0.35, 0.1]],
      [[0, 0, 0], [sign * 0.15, -0.18, 0.35], [sign * 0.29, -0.12, 0.65]], 0.06, ink);
    const shoe = ball(leg, ink, [sign * 0.08, -0.38, 0.15], [0.23, 0.13, 0.32]);
    bee.add(leg);
    legs.push({ leg, shin, shoe, sign });

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
  const mouth = expressiveTube(head,
    [[-0.2, 0.65, 0.735], [0, 0.57, 0.77], [0.2, 0.65, 0.735]].map(facePoint),
    [[-0.25, 0.67, 0.735], [0, 0.51, 0.79], [0.25, 0.67, 0.735]].map(facePoint),
    [[-0.2, 0.53, 0.735], [0, 0.65, 0.77], [0.2, 0.53, 0.735]].map(facePoint), 0.022, ink);
  mouths.push(mouth);
  const openSmile = ball(head, ink, facePoint([0, 0.595, 0.761]), [0.205, 0.11, 0.025]);
  const smileTeeth = ball(head, white, facePoint([0, 0.651, 0.787]), [0.15, 0.024, 0.012]);

  /* The case hangs from the left hand, with its handle centered inside the glove. */
  const briefcase = new THREE.Group();
  briefcase.position.set(-0.41, -0.93, 0.62);
  briefcase.rotation.z = -0.08;
  briefcase.scale.setScalar(0.82);
  const caseShape = new THREE.Shape();
  caseShape.moveTo(-0.45, -0.31);
  caseShape.lineTo(0.45, -0.31);
  caseShape.quadraticCurveTo(0.5, -0.31, 0.5, -0.26);
  caseShape.lineTo(0.5, 0.25);
  caseShape.quadraticCurveTo(0.5, 0.31, 0.44, 0.31);
  caseShape.lineTo(-0.44, 0.31);
  caseShape.quadraticCurveTo(-0.5, 0.31, -0.5, 0.25);
  caseShape.lineTo(-0.5, -0.26);
  caseShape.quadraticCurveTo(-0.5, -0.31, -0.45, -0.31);
  const caseShell = new THREE.Mesh(new THREE.ExtrudeGeometry(caseShape, {
    depth: 0.16, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2
  }), ink);
  caseShell.position.z = -0.08;
  briefcase.add(caseShell);
  const casePanel = new THREE.MeshStandardMaterial({ color: "#3c4652", roughness: 0.4, metalness: 0.14 });
  box(briefcase, casePanel, [0, -0.015, 0.113], [0.87, 0.5, 0.025]);
  box(briefcase, cream, [0, 0.105, 0.133], [0.84, 0.018, 0.012]);
  [-0.3, 0.3].forEach(x => box(briefcase, cream, [x, 0.105, 0.144], [0.075, 0.095, 0.018]));
  box(briefcase, honey, [0, 0.105, 0.147], [0.075, 0.065, 0.02]);
  tube(briefcase, [[-0.19, 0.3, -0.04], [-0.19, 0.47, -0.04], [0, 0.52, -0.04], [0.19, 0.47, -0.04], [0.19, 0.3, -0.04]], 0.038, ink);
  box(briefcase, cream, [0, 0.52, -0.04], [0.16, 0.018, 0.018]);
  arms.find(({ sign }) => sign === -1).arm.add(briefcase);

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
    const { excited, sad } = expression;
    const motion = media.matches ? 0 : 1;
    bee.rotation.set(0, 0, -sad * 0.025 + Math.sin(elapsed * 3) * excited * motion * 0.018);
    bee.position.y = -sad * 0.09 + Math.sin(elapsed * (1.7 + excited * 1.6)) * (0.025 + excited * 0.045) * (1 - sad) * motion;
    head.position.set(0, 0.88 - sad * 0.17 + excited * 0.025, 0.12);
    head.rotation.set(sad * 0.12 - excited * 0.018, 0, -sad * 0.055);
    eyes.forEach(({ eye, pupil, glint }) => {
      eye.scale.y = 0.275 * (1 + excited * 0.09 + sad * 0.04);
      pupil.position.y = 0.14 - sad * 0.035 + excited * 0.01;
      pupil.scale.y = 0.145 * (1 + excited * 0.07);
      glint.position.y = 0.19 - sad * 0.035 + excited * 0.01;
      const sparkle = 1 + sad * 0.1;
      glint.scale.set(0.035 * sparkle, 0.042 * sparkle, 0.017 * sparkle);
    });
    [...brows, ...mouths].forEach(mesh => { mesh.morphTargetInfluences[0] = excited; mesh.morphTargetInfluences[1] = sad; });
    openSmile.visible = excited > 0.02;
    smileTeeth.visible = excited > 0.02;
    openSmile.scale.set(0.205, Math.max(0.001, 0.11 * excited), 0.025);
    smileTeeth.scale.set(0.15, Math.max(0.001, 0.024 * excited), 0.012);
    antennae.forEach(({ antenna, sign }) => { antenna.rotation.z = sign * (sad * 0.18 - excited * 0.05); });
    arms.forEach(({ arm, sign }) => {
      arm.rotation.set(-sad * 0.1, 0, sign * (excited * 0.56 - sad * 0.12));
    });
    legs.forEach(({ leg, shin, shoe, sign }) => {
      shin.morphTargetInfluences[0] = excited;
      shin.morphTargetInfluences[1] = sad;
      shoe.position.set(sign * (0.08 + sad * 0.21), -0.38 + sad * 0.26 + excited * 0.03, 0.15 + sad * 0.6);
      shoe.rotation.x = -sad * 0.12;
      leg.rotation.z = sign * excited * 0.05;
    });
    wings.forEach(({ pivot, sign }) => {
      const flutter = Math.sin(elapsed * (12 + excited * 3)) * (0.18 + excited * 0.04) * (1 - sad) * motion;
      pivot.rotation.y = sign * (0.25 + sad * 0.4 + flutter);
      pivot.rotation.z = -sign * (0.48 + sad * 1.65 + Math.sin(elapsed * 12) * 0.025 * (1 - sad) * motion);
    });
  }

  /* A single union envelope keeps eye contact and scale stable across expressions. */
  [{ excited: 0, sad: 0 }, { excited: 1, sad: 0 }, { excited: 0, sad: 1 }].forEach(state => {
    expression = state;
    pose();
    bee.updateMatrixWorld(true);
    portraitBounds.expandByObject(bee);
  });
  expression = { excited: 0, sad: 0 };
  pose();
  portraitBounds.getCenter(center);
  portraitBounds.getSize(size);
  canvas.dataset.mood = mood;

  function resize() {
    if (disposed) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width || canvas.clientWidth || 150);
    const height = Math.max(1, rect.height || canvas.clientHeight || 190);
    const aspect = width / height;
    const halfHeight = Math.max(size.y / 2 + 0.13, (size.x / 2 + 0.11) / aspect);
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

  function updateExpression(timestamp) {
    if (!transition) return;
    const amount = Math.min(1, Math.max(0, (timestamp - transition.started) / 400));
    const blend = amount * amount * (3 - 2 * amount);
    expression.excited = THREE.MathUtils.lerp(transition.from.excited, transition.to.excited, blend);
    expression.sad = THREE.MathUtils.lerp(transition.from.sad, transition.to.sad, blend);
    if (amount === 1) transition = null;
  }

  function draw(timestamp) {
    if (disposed || document.hidden) return;
    try {
      updateExpression(timestamp);
      pose();
      renderer.render(scene, camera);
      if (renderer.getContext().isContextLost()) throw new Error("Context lost");
      if (renderer.info.render.calls > 0) canvas.classList.add("is-ready");
    } catch (error) {
      canvas.dataset.renderError = error instanceof Error ? error.message : "Portrait render failed";
      dispose("render-error");
    }
  }

  function renderStill() {
    if (disposed || document.hidden) return;
    resize();
    draw(window.performance.now());
  }

  function setMood(nextMood = "neutral") {
    if (disposed) return;
    const next = ["neutral", "excited", "sad"].includes(nextMood) ? nextMood : "neutral";
    if (next === mood && canvas.classList.contains("is-ready")) return;
    updateExpression(window.performance.now());
    mood = next;
    canvas.dataset.mood = mood;
    const target = { excited: mood === "excited" ? 1 : 0, sad: mood === "sad" ? 1 : 0 };
    if (running && !media.matches && !document.hidden) {
      transition = { from: { ...expression }, to: target, started: window.performance.now() };
      requestRender();
    } else {
      transition = null;
      expression = target;
      renderStill();
    }
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
    draw(timestamp);
    if (!disposed && !media.matches) requestRender();
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
    if (transition) {
      expression = { ...transition.to };
      transition = null;
      renderStill();
    }
  }

  function dispose(reason = "api") {
    if (disposed) return;
    canvas.dataset.disposeReason = String(reason);
    disposed = true;
    stop();
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
    renderer.forceContextLoss();
    canvas.classList.remove("is-ready");
    instances.delete(canvas);
  }

  function refresh() {
    if (disposed) return;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastPaint = 0;
    if (!document.hidden) {
      if (media.matches && transition) { expression = { ...transition.to }; transition = null; }
      resize();
      if (running) paint(window.performance.now(), true);
      else draw(window.performance.now());
    }
  }

  document.addEventListener("visibilitychange", refresh, { signal });
  media.addEventListener("change", refresh, { signal });
  window.addEventListener("resize", refresh, { passive: true, signal });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    canvas.dataset.renderError = "WebGL context lost";
    dispose("webgl-context-lost");
  }, { signal });
  if (typeof ResizeObserver === "function") {
    resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(canvas);
  }
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) {
      const wasRunning = running;
      stop();
      resumeAfterRestore = wasRunning;
    } else dispose("pagehide");
  }, { signal });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && resumeAfterRestore) {
      resumeAfterRestore = false;
      start();
    }
  }, { signal });
  const api = Object.freeze({ start, stop, dispose, setMood });
  instances.set(canvas, api);
  return api;
}
