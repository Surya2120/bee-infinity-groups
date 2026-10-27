/* SPECTRUM's decorative WebGL sculpture. Build with the locally installed esbuild/Three.js. */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;
const palette = ["#f5c841", "#ffab65", "#e386be", "#b39be2", "#66b6de", "#77c8b6"];

function bootScene() {
  const canvas = document.getElementById("spectrumCanvas");
  if (!canvas || canvas.dataset.sceneInitialized) return;
  canvas.dataset.sceneInitialized = "true";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.pointerEvents = "none";

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "default" });
  } catch {
    return;
  }

  const events = new AbortController();
  const signal = events.signal;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  const rig = new THREE.Group();
  const bee = new THREE.Group();
  const orbit = new THREE.Group();
  const trinkets = [];
  const wings = [];
  const textures = new Set();
  let environmentTarget;
  let resizeObserver;
  let raf = 0;
  let dead = false;
  let ready = false;
  let visible = true;
  let mobile = window.innerWidth <= 760;
  let width = 1;
  let height = 1;
  let availableSceneHeight = 1;
  let mobileEndingBand = null;
  let progress = 0;
  let targetProgress = 0;
  let reducedMotion = media.matches;
  let paused = false;
  let elapsed = 0;
  let lastPaint = 0;
  let lastProgressEvent;
  let hasProgressSignal = false;
  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  const lookAt = new THREE.Vector3();

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  scene.add(rig);
  rig.add(orbit, bee);

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
  const coloredMaterials = palette.map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.28, metalness: 0.3 }));
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

  /* Rounded anatomy, raised stripes, and the clapper cue from the supplied Bee.png. */
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

  function rainbowRing(radius, thickness, arc) {
    const geometry = new THREE.TorusGeometry(radius, thickness, 10, 128, arc);
    const positions = geometry.getAttribute("position");
    const colors = [];
    const color = new THREE.Color();
    for (let i = 0; i < positions.count; i++) {
      const hue = (Math.atan2(positions.getY(i), positions.getX(i)) / TAU + 1) % 1;
      color.setHSL(hue, 0.65, 0.63);
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.63, roughness: 0.24 }));
  }

  const halo = rainbowRing(2.04, 0.063, TAU * 0.92);
  halo.position.set(0, 0.1, -0.53);
  halo.rotation.set(0.17, -0.25, 0.36);
  orbit.add(halo);
  const equator = rainbowRing(2.26, 0.027, TAU * 0.79);
  equator.position.set(0, 0.05, -0.25);
  equator.rotation.set(1.12, 0.2, -0.26);
  orbit.add(equator);

  const hex = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const x = Math.cos(i * TAU / 6) * 0.16;
    const y = Math.sin(i * TAU / 6) * 0.16;
    if (i) hex.lineTo(x, y);
    else hex.moveTo(x, y);
  }
  hex.closePath();
  const hexGeometry = new THREE.ExtrudeGeometry(hex, { depth: 0.06, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.018, bevelSegments: 2, steps: 1 });
  for (let i = 0; i < 12; i++) {
    const angle = i * TAU / 12 + 0.12;
    const radius = 2.22 + (i % 3) * 0.1;
    const mesh = new THREE.Mesh(i % 3 === 0 ? new THREE.BoxGeometry(0.07, 0.2, 0.06) : hexGeometry, coloredMaterials[i % palette.length]);
    const base = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.85 + 0.12, Math.sin(i * 1.7) * 0.65);
    mesh.position.copy(base);
    mesh.rotation.set(i * 0.23, i * 0.47, angle);
    orbit.add(mesh);
    trinkets.push({ mesh, base, phase: i * 0.71 });
  }
  const glass = new THREE.MeshPhysicalMaterial({ color: "#a5d9e9", metalness: 0.08, roughness: 0.12, transparent: true, opacity: 0.7, clearcoat: 1 });
  ball(orbit, glass, [1.82, 1.17, 0.45], [0.23, 0.23, 0.23]);
  ball(orbit, coloredMaterials[2], [-1.8, -0.8, 0.2], [0.12, 0.12, 0.12]);

  const stage = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 0.16, 64), [cream, white, cream]);
  stage.position.y = -1.84;
  rig.add(stage);
  const stageRim = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.018, 7, 64), honey);
  stageRim.rotation.x = Math.PI / 2;
  stageRim.position.y = -1.75;
  rig.add(stageRim);

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const shadowContext = shadowCanvas.getContext("2d");
  if (shadowContext) {
    const gradient = shadowContext.createRadialGradient(128, 128, 10, 128, 128, 118);
    gradient.addColorStop(0, "rgba(33,41,46,.35)");
    gradient.addColorStop(0.5, "rgba(33,41,46,.13)");
    gradient.addColorStop(1, "rgba(33,41,46,0)");
    shadowContext.fillStyle = gradient;
    shadowContext.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(shadowCanvas);
    textures.add(texture);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.5), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.68 }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0.05, -1.95, 0.05);
    rig.add(shadow);
  }

  /* The supplied mascot is also presented unchanged on a small physical keepsake. */
  const keepsake = new THREE.Group();
  keepsake.position.set(1.55, -0.83, 0.55);
  keepsake.rotation.set(-0.08, -0.18, 0.12);
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.075, 40), cream);
  coin.rotation.x = Math.PI / 2;
  keepsake.add(coin);
  const logoMaterial = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false });
  const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.61, 0.61), logoMaterial);
  decal.position.z = 0.043;
  keepsake.add(decal);
  orbit.add(keepsake);
  new THREE.TextureLoader().load(new URL("../assets/images/logo/Bee.png", import.meta.url).href, (texture) => {
    if (dead) { texture.dispose(); return; }
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture);
    logoMaterial.map = texture;
    logoMaterial.needsUpdate = true;
    requestRender();
  }, undefined, () => {});

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
  } catch {
    // Direct lights still provide a complete scene on constrained graphics devices.
  }

  const poses = [
    { x: 0.72, y: 0.51, z: 0, scale: 0.98, yaw: -0.24, roll: -0.035, camera: 10.2 },
    { x: 0.27, y: 0.5, z: 0.25, scale: 0.94, yaw: 0.34, roll: 0.045, camera: 9.4 },
    { x: 0.72, y: 0.38, z: -0.2, scale: 0.87, yaw: -0.04, roll: -0.025, camera: 10.6 },
    { x: 0.72, y: 0.51, z: 0.15, scale: 0.96, yaw: -0.3, roll: 0.035, camera: 9.8 }
  ];

  function canAnimate() {
    return !dead && visible && !document.hidden && !paused && !reducedMotion;
  }

  function readLayoutProgress() {
    const chapters = Array.from(document.querySelectorAll(".spectrum-chapter[data-spectrum-step]"));
    if (!chapters.length) return;
    const headerHeight = Number.parseFloat(window.getComputedStyle(document.body).getPropertyValue("--site-header-height")) || (window.innerWidth <= 980 ? 80 : 92);
    const first = chapters[0].getBoundingClientRect();
    if (!hasProgressSignal) {
      let index = 0;
      chapters.forEach((chapter, i) => { if (chapter.getBoundingClientRect().top <= headerHeight) index = i; });
      const currentTop = chapters[index].getBoundingClientRect().top;
      const nextTop = chapters[index + 1]?.getBoundingClientRect().top;
      const local = Number.isFinite(nextTop) ? clamp((headerHeight - currentTop) / (nextTop - currentTop), 0, 1) : 0;
      targetProgress = clamp((index + local) / Math.max(1, chapters.length - 1), 0, 1);
    }
    const footer = document.querySelector(".home-footer");
    const stageTop = canvas.getBoundingClientRect().top;
    availableSceneHeight = footer ? clamp(footer.getBoundingClientRect().top - stageTop, 0, height) : height;
    mobileEndingBand = null;
    if (mobile) {
      const endingCopy = document.querySelector("#spectrum-connect .spectrum-copy");
      const endingInner = document.querySelector("#spectrum-connect .spectrum-section-inner");
      if (endingCopy && endingInner) {
        const copyRect = endingCopy.getBoundingClientRect();
        const top = clamp(copyRect.bottom - stageTop, 0, availableSceneHeight);
        const bottom = clamp(endingInner.getBoundingClientRect().bottom - stageTop, 0, availableSceneHeight);
        const mix = THREE.MathUtils.smoothstep(stageTop + 320 - copyRect.top, 0, 110);
        if (bottom > top && mix > 0) mobileEndingBand = { top, bottom, mix };
      }
    }
    visible = first.top < window.innerHeight && availableSceneHeight > 1;
    canvas.style.visibility = visible ? "visible" : "hidden";
  }

  function applyPose(delta) {
    if (canAnimate()) {
      elapsed += delta;
      progress = THREE.MathUtils.lerp(progress, targetProgress, Math.min(1, delta * 9));
      pointer.lerp(pointerTarget, Math.min(1, delta * 5));
    } else {
      progress = targetProgress;
      pointer.set(0, 0);
    }
    const section = clamp(progress * 3, 0, 3);
    const index = Math.min(2, Math.floor(section));
    const mix = THREE.MathUtils.smoothstep(section - index, 0, 1);
    const start = poses[index];
    const end = poses[index + 1];
    const value = (property) => THREE.MathUtils.lerp(start[property], end[property], mix);
    const cameraZ = value("camera") + (mobile ? 0.8 : 0);
    camera.position.set(pointer.x * 0.1, 0.2 + pointer.y * 0.07, cameraZ);
    camera.lookAt(lookAt.set(0, 0, 0));
    const worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (cameraZ - value("z"));
    const screenX = mobile ? 0.5 : value("x");
    const baseY = mobile ? Math.min(155, height * 0.23) : value("y") * height;
    const footerDock = THREE.MathUtils.smoothstep(height - availableSceneHeight, 0, height * 0.3);
    let centerY = THREE.MathUtils.lerp(baseY, Math.min(baseY, availableSceneHeight / 2), footerDock);
    const footerFit = Math.min(1, availableSceneHeight / (mobile ? 320 : height * 0.78));
    let scaleFit = THREE.MathUtils.lerp(1, footerFit, footerDock);
    if (mobileEndingBand) {
      const { top, bottom, mix } = mobileEndingBand;
      centerY = THREE.MathUtils.lerp(centerY, (top + bottom) / 2, mix);
      scaleFit = THREE.MathUtils.lerp(scaleFit, Math.min(1, (bottom - top) / 320), mix);
    }
    const screenY = centerY / height;
    rig.position.set((screenX - 0.5) * worldHeight * camera.aspect, (0.5 - screenY) * worldHeight, value("z"));
    rig.scale.setScalar(value("scale") * (mobile ? 0.48 : 1) * scaleFit);
    rig.rotation.set(pointer.y * 0.035, value("yaw") + pointer.x * 0.1, value("roll"));
    bee.position.y = Math.sin(elapsed * 1.7) * 0.07;
    bee.rotation.y = Math.sin(elapsed * 0.65) * 0.045;
    wings.forEach(({ pivot, sign }) => {
      pivot.rotation.y = sign * (0.25 + Math.sin(elapsed * 15) * 0.21);
      pivot.rotation.z = -sign * (0.48 + Math.sin(elapsed * 15) * 0.025);
    });
    const worldMoment = Math.sin(progress * Math.PI) ** 2;
    orbit.rotation.y = Math.sin(elapsed * 0.2) * 0.035 + progress * 0.16;
    halo.rotation.z = 0.36 + elapsed * 0.025;
    equator.rotation.z = -0.26 - elapsed * 0.018;
    trinkets.forEach(({ mesh, base, phase }) => {
      mesh.position.copy(base).multiplyScalar(1 + worldMoment * 0.12);
      mesh.position.y += Math.sin(elapsed * 1.1 + phase) * 0.035;
      mesh.rotation.y = phase + elapsed * 0.14;
    });
    keepsake.rotation.y = -0.18 + Math.sin(elapsed * 0.8) * 0.08;
  }

  function failScene() {
    dead = true;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    document.body.classList.remove("spectrum-scene-ready");
    window.dispatchEvent(new CustomEvent("spectrum:scene-error"));
  }

  function paint(timestamp) {
    raf = 0;
    if (dead || document.hidden || !visible) return;
    const interval = mobile ? 1000 / 30 : 1000 / 50;
    if (canAnimate() && lastPaint && timestamp - lastPaint < interval) {
      raf = window.requestAnimationFrame(paint);
      return;
    }
    const delta = lastPaint ? Math.min((timestamp - lastPaint) / 1000, 0.06) : 1 / 60;
    lastPaint = timestamp;
    try {
      applyPose(delta);
      renderer.render(scene, camera);
      if (renderer.getContext().isContextLost()) { failScene(); return; }
      if (!ready && renderer.info.render.calls > 0) {
        ready = true;
        document.body.classList.add("spectrum-scene-ready");
        window.dispatchEvent(new CustomEvent("spectrum:scene-ready", { detail: { renderer: "webgl" } }));
      }
    } catch {
      failScene();
      return;
    }
    if (canAnimate()) raf = window.requestAnimationFrame(paint);
  }

  function requestRender() {
    if (!dead && !document.hidden && visible && !raf) raf = window.requestAnimationFrame(paint);
  }

  function refreshVisibility() {
    readLayoutProgress();
    if (!canAnimate() && raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
    requestRender();
  }

  function resize() {
    if (dead) return;
    const rect = canvas.getBoundingClientRect();
    mobile = window.innerWidth <= 760;
    width = Math.max(1, rect.width || window.innerWidth);
    height = Math.max(1, rect.height || window.innerHeight - (window.innerWidth <= 980 ? 80 : 92));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    refreshVisibility();
  }

  function onProgress(event) {
    if (event === lastProgressEvent || !event.detail) return;
    lastProgressEvent = event;
    const detail = event.detail;
    if (Number.isFinite(detail.progress)) {
      hasProgressSignal = true;
      targetProgress = clamp(detail.progress, 0, 1);
    }
    if (typeof detail.reducedMotion === "boolean") reducedMotion = detail.reducedMotion;
    if (typeof detail.paused === "boolean") paused = detail.paused;
    readLayoutProgress();
    if (!canAnimate() && raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
    requestRender();
  }

  window.addEventListener("spectrum:progress", onProgress, { signal });
  document.addEventListener("spectrum:progress", onProgress, { signal });
  window.addEventListener("resize", resize, { passive: true, signal });
  window.addEventListener("scroll", refreshVisibility, { passive: true, signal });
  window.addEventListener("load", resize, { once: true, signal });
  document.addEventListener("visibilitychange", () => {
    lastPaint = 0;
    refreshVisibility();
  }, { signal });
  media.addEventListener("change", () => {
    reducedMotion = media.matches;
    refreshVisibility();
  }, { signal });
  window.addEventListener("pointermove", (event) => {
    if (mobile || !canAnimate() || event.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    pointerTarget.set(clamp(event.clientX / width * 2 - 1, -1, 1), clamp(1 - (event.clientY - rect.top) / height * 2, -1, 1));
    requestRender();
  }, { passive: true, signal });
  window.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) pointerTarget.set(0, 0);
  }, { passive: true, signal });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    failScene();
  }, { signal });
  if (typeof ResizeObserver === "function" && canvas.parentElement) {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement);
  }

  function dispose() {
    dead = true;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
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
    textures.forEach((texture) => texture.dispose());
    environmentTarget?.dispose();
    renderer.dispose();
  }
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    } else dispose();
  }, { signal });
  window.addEventListener("pageshow", () => {
    lastPaint = 0;
    refreshVisibility();
  }, { signal });
  readLayoutProgress();
  progress = targetProgress;
  resize();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootScene, { once: true });
else bootScene();
