/**
 * The studio: an e-ink notebook and a laptop on a paper desk, drawn with Three.js.
 * Loaded lazily by KindleStudio.astro, and only on the Kindle project page.
 *
 * The scene never runs a loop of its own. The caller renders a state (a pure function of
 * one timeline position), so playback, scrubbing and chapter jumps share one code path,
 * and nothing is drawn while the figure is idle, hidden or offscreen.
 */
import {
  AmbientLight, CanvasTexture, Color, CylinderGeometry, ConeGeometry, DirectionalLight, Group,
  InstancedMesh, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, OrthographicCamera,
  PlaneGeometry, QuadraticBezierCurve3, Quaternion, RepeatWrapping, SRGBColorSpace, Scene,
  CircleGeometry, Vector3, WebGLRenderer, type Texture,
} from 'three';
import { readPalette } from './scene-palette';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { INK, MARK, pointAt, sample } from './ink-paths';
import { SHEET_H, SHEET_W, paintBrowser, paintKeys, paintScribe, paintShadow } from './sheet-canvas';
import type { StrokeState } from './stroke-progress';

const INK_POINTS = sample(INK);
const MARK_POINTS = sample(MARK);
const smooth = (x: number) => x * x * (3 - 2 * x);

export interface Label { el: HTMLElement; anchor: Object3D }

export interface Studio {
  render(state: StrokeState): void;
  refreshTheme(): void;
  resize(): void;
  dispose(): void;
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function texture(c: HTMLCanvasElement, maxAniso: number) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}

export function createStudio(host: HTMLElement, labels: { scribe?: HTMLElement; laptop?: HTMLElement } = {}): Studio {
  let palette = readPalette(host);
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color(palette['surface']), 1);
  const el = renderer.domElement;
  el.setAttribute('aria-hidden', 'true');
  el.classList.add('studio-canvas');
  host.prepend(el);

  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, .1, 400);
  const target = new Vector3();
  const lookFrom = new Vector3(6, 19, 16).normalize().multiplyScalar(80);

  const ambient = new AmbientLight(palette['on-media'], 1.9);
  scene.add(ambient);
  const sun = new DirectionalLight(palette['on-media'], 1.6);
  sun.position.set(-14, 26, 12);
  scene.add(sun);

  // ── Desk: drafting paper with a faint dot grid ──────────────────────────────
  const dots = canvas(64, 64);
  const paintDesk = () => {
    const g = dots.getContext('2d')!;
    g.fillStyle = palette['surface']; g.fillRect(0, 0, 64, 64);
    g.fillStyle = palette['surface-2'];
    g.beginPath(); g.arc(8, 8, 1.6, 0, Math.PI * 2); g.fill();
  };
  paintDesk();
  const deskTex = keep(texture(dots, aniso));
  deskTex.wrapS = deskTex.wrapT = RepeatWrapping;
  deskTex.repeat.set(160, 160);
  const desk = new Mesh(keep(new PlaneGeometry(320, 320)), keep(new MeshBasicMaterial({ map: deskTex })));
  desk.rotation.x = -Math.PI / 2;
  scene.add(desk);

  const shadowCanvas = canvas(256, 256);
  paintShadow(palette, shadowCanvas, 46, 26, 34);
  const shadowTex = keep(texture(shadowCanvas, aniso));
  const shadowMat = keep(new MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: .28, depthWrite: false }));
  const shadow = (w: number, d: number) => {
    const m = new Mesh(keep(new PlaneGeometry(w, d)), shadowMat);
    m.rotation.x = -Math.PI / 2;
    m.position.y = .02;
    return m;
  };

  const body = keep(new MeshLambertMaterial({ color: palette['chassis'] }));

  // ── Scribe: a flat slab with a wide grip bezel on the left ─────────────
  const scribe = new Group();
  const SW = 10.4, SH = SW * SHEET_H / SHEET_W;
  const slab = new Mesh(keep(new RoundedBoxGeometry(SW + 3.4, .5, SH + 1.7, 4, .38)), body);
  slab.position.set(-.85, .25, 0);
  const scribeCanvas = canvas(640, Math.round(640 * SHEET_H / SHEET_W));
  const scribeTex = keep(texture(scribeCanvas, aniso));
  const scribeScreen = new Mesh(keep(new PlaneGeometry(SW, SH)), keep(new MeshBasicMaterial({ map: scribeTex })));
  scribeScreen.rotation.x = -Math.PI / 2;
  scribeScreen.position.y = .505;
  const scribeShadow = shadow(SW + 7, SH + 6);
  scribeShadow.position.set(.2, .02, .9);
  scribe.add(scribeShadow, slab, scribeScreen);
  const scribeAnchor = new Object3D();
  scribeAnchor.position.set(-SW / 2 - 1.6, .5, -SH / 2 - .9);
  scribe.add(scribeAnchor);
  scene.add(scribe);

  // ── Laptop: base, keyboard well, a lid tilted back, Live View on screen ─
  const laptop = new Group();
  const LW = 20, LD = 13.4;
  const base = new Mesh(keep(new RoundedBoxGeometry(LW, .55, LD, 4, .3)), keep(new MeshLambertMaterial({ color: palette['metal'] })));
  base.position.y = .275;
  const keysCanvas = canvas(512, 200);
  paintKeys(palette, keysCanvas);
  const keys = new Mesh(keep(new PlaneGeometry(LW * .86, LD * .38)), keep(new MeshBasicMaterial({ map: keep(texture(keysCanvas, aniso)) })));
  keys.rotation.x = -Math.PI / 2;
  keys.position.set(0, .556, -LD * .17);
  const pad = new Mesh(keep(new PlaneGeometry(LW * .3, LD * .27)), keep(new MeshBasicMaterial({ color: palette['chassis'] })));
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, .556, LD * .29);
  const lid = new Group();
  lid.position.set(0, .55, -LD / 2 + .1);
  lid.rotation.x = -.24;
  const lidShell = new Mesh(keep(new RoundedBoxGeometry(LW, LD - .4, .42, 4, .2)), body);
  lidShell.position.y = (LD - .4) / 2;
  const browserCanvas = canvas(1024, 640);
  const browserTex = keep(texture(browserCanvas, aniso));
  const bh = LD - 1.7, bw = bh * 1.6;
  const browserScreen = new Mesh(keep(new PlaneGeometry(bw, bh)), keep(new MeshBasicMaterial({ map: browserTex })));
  browserScreen.position.set(0, (LD - .4) / 2 + .15, .215);
  lid.add(lidShell, browserScreen);
  const laptopShadow = shadow(LW + 7, LD + 7);
  laptopShadow.position.set(.4, .02, .6);
  laptop.add(laptopShadow, base, keys, pad, lid);
  const laptopAnchor = new Object3D();
  laptopAnchor.position.set(LW / 2 - 1, LD + .2, 0);
  lid.add(laptopAnchor);
  scene.add(laptop);

  // ── Stylus ──────────────────────────────────────────────────────────────
  const STYLUS = 12;
  const stylus = new Group();
  const barrel = new Mesh(keep(new CylinderGeometry(.27, .27, STYLUS - 1, 18)), keep(new MeshLambertMaterial({ color: palette['chassis'] })));
  barrel.position.y = (STYLUS - 1) / 2 + 1;
  const nib = new Mesh(keep(new ConeGeometry(.27, 1, 18)), keep(new MeshLambertMaterial({ color: palette['chassis'] })));
  nib.rotation.x = Math.PI;
  nib.position.y = .5;
  stylus.add(barrel, nib);
  const stylusShadow = new Mesh(keep(new PlaneGeometry(1.4, STYLUS + 1)), keep(shadowMat.clone()));
  stylusShadow.rotation.x = -Math.PI / 2;
  scene.add(stylus, stylusShadow);

  // ── The thread: a dotted arc that is drawn once, from page to screen ────
  const DOTS = 44;
  const bead = keep(new CircleGeometry(.13, 10));
  const threadMat = keep(new MeshBasicMaterial({ color: palette['accent'], transparent: true }));
  const thread = new InstancedMesh(bead, threadMat, DOTS);
  const pulse = new Mesh(keep(new CircleGeometry(.3, 18)), keep(new MeshBasicMaterial({ color: palette['accent'] })));
  scene.add(thread, pulse);
  const curve = new QuadraticBezierCurve3(new Vector3(), new Vector3(), new Vector3());
  const dummy = new Object3D();

  // ── Layout: side by side when wide, staggered in depth when tall ───────
  let aspect = 16 / 9;
  const layout = () => {
    const tall = aspect < 1.05;
    if (tall) {
      scribe.position.set(-2.6, 0, 5.6);
      scribe.rotation.y = .1;
      laptop.position.set(3.6, 0, -9.4);
      laptop.rotation.y = -.18;
    } else {
      scribe.position.set(-12.2, 0, 1.4);
      scribe.rotation.y = .12;
      laptop.position.set(9.4, 0, -1.6);
      laptop.rotation.y = -.2;
    }
    scene.updateMatrixWorld(true);
    // Arc from the top edge of the Scribe to the centre of the browser page.
    const a = scribeScreen.localToWorld(new Vector3(0, SH / 2 + .2, 0));
    const b = browserScreen.localToWorld(new Vector3(-bw * .18, -bh * .12, .05));
    const mid = a.clone().lerp(b, .5);
    mid.y = Math.max(a.y, b.y) + (tall ? 6 : 8);
    curve.v0.copy(a); curve.v1.copy(mid); curve.v2.copy(b);
  };

  const size = { w: 1, h: 1 };
  const fit = { height: 26 };
  const resize = () => {
    const rect = host.getBoundingClientRect();
    size.w = Math.max(1, Math.round(rect.width));
    size.h = Math.max(1, Math.round(rect.height));
    renderer.setSize(size.w, size.h, false);
    aspect = size.w / size.h;
    // Fit the composition's footprint: ~44 × 26 units wide, ~30 × 34 when stacked.
    fit.height = aspect < 1.05 ? Math.max(34, 30 / aspect) : Math.max(31, 55 / aspect);
    layout();
  };

  // ── Per-frame state ─────────────────────────────────────────────────────
  const page = new Vector3();
  const restTip = new Vector3();
  const restQ = new Quaternion();
  const drawQ = new Quaternion();
  const up = new Vector3(0, 1, 0);
  const lean = new Vector3();
  const tip = new Vector3();
  const axis = new Vector3();
  const q = new Quaternion();
  const look = new Vector3();
  const scribeCentre = new Vector3();
  const browserCentre = new Vector3();
  let painted = '';

  const sheetPoint = (x: number, y: number, zoom: number, out: Vector3) => {
    const cx = SHEET_W * .65, cy = SHEET_H * .63;
    const zx = cx + (x - cx) * zoom, zy = cy + (y - cy) * zoom;
    return scribeScreen.localToWorld(out.set((zx / SHEET_W - .5) * SW, (.5 - zy / SHEET_H) * SH, .02));
  };

  const projectLabel = (label: HTMLElement | undefined, anchor: Object3D) => {
    if (!label) return;
    const v = anchor.getWorldPosition(look).project(camera);
    const w = label.offsetWidth, h = label.offsetHeight;
    const x = Math.min(size.w - w - 8, Math.max(8, (v.x + 1) / 2 * size.w));
    const y = Math.min(size.h - 8, Math.max(h + 8, (1 - v.y) / 2 * size.h));
    label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };

  const render = (s: StrokeState) => {
    // Screens: repaint the 2D textures only when the drawn state changes.
    const key = [s.pen, s.mark, s.paper, s.zoom, s.mirror, s.markMirror].map((n) => n.toFixed(3)).join();
    if (key !== painted) {
      painted = key;
      paintScribe(palette, scribeCanvas, { ink: s.pen, mark: s.mark, paper: s.paper, zoom: s.zoom });
      paintBrowser(palette, browserCanvas, { ink: s.mirror, mark: s.markMirror, paper: s.paper, zoom: s.zoom });
      scribeTex.needsUpdate = true;
      browserTex.needsUpdate = true;
    }

    // Stylus: rests beside the Scribe, lifts, follows the stroke, returns.
    const reach = smooth(s.stylus);
    const pts = s.stylusOn === 'mark' ? MARK_POINTS : INK_POINTS;
    const progress = s.stylusOn === 'mark' ? s.mark : s.pen;
    const p = pointAt(pts, progress);
    sheetPoint(p.x, p.y, 1, page);
    scribe.localToWorld(restTip.set(SW / 2 + 2.6, .27, SH / 2 - 1.5));
    restQ.setFromUnitVectors(up, lean.set(-.1, .0, -1).normalize());
    restQ.premultiply(q.setFromAxisAngle(up, scribe.rotation.y));
    // Lean across the line of sight so the barrel reads at full length while drawing.
    drawQ.setFromUnitVectors(up, lean.set(.78, .78, -.32).normalize());
    tip.lerpVectors(restTip, page, reach);
    tip.y += Math.sin(Math.PI * reach) * 2.4 * (1 - reach * .6);
    stylus.position.copy(tip);
    stylus.quaternion.slerpQuaternions(restQ, drawQ, reach);
    // A resting shadow under the barrel; it fades once the pen is lifted.
    axis.set(0, 1, 0).applyQuaternion(stylus.quaternion);
    stylusShadow.position.set(tip.x + axis.x * STYLUS / 2 + .35 + tip.y * .5, .03, tip.z + axis.z * STYLUS / 2 - tip.y * .25);
    stylusShadow.rotation.z = Math.atan2(-axis.x, -axis.z);
    stylusShadow.scale.set(1 + reach * .6, Math.max(.2, Math.hypot(axis.x, axis.z)), 1);
    (stylusShadow.material as MeshBasicMaterial).opacity = .28;

    // Thread: dots appear along the arc, a single bead runs it while the mirror catches up.
    const shown = Math.round(s.signal * DOTS);
    for (let i = 0; i < DOTS; i++) {
      curve.getPoint(i / (DOTS - 1), dummy.position);
      dummy.quaternion.copy(camera.quaternion);
      dummy.scale.setScalar(i < shown ? 1 : 0);
      dummy.updateMatrix();
      thread.setMatrixAt(i, dummy.matrix);
    }
    thread.instanceMatrix.needsUpdate = true;
    threadMat.opacity = .85 - .45 * s.paper;
    const run = s.signal >= 1 ? Math.min(1, s.mirror * 1.1) : s.signal;
    pulse.visible = s.pen > 0 && s.mirror < 1 && s.signal > 0;
    curve.getPoint(run, pulse.position);
    pulse.quaternion.copy(camera.quaternion);

    // Camera: drifts toward whichever screen matters, then pushes in for the zoom.
    scribeCentre.setFromMatrixPosition(scribeScreen.matrixWorld);
    browserCentre.setFromMatrixPosition(browserScreen.matrixWorld);
    const mid = look.lerpVectors(scribeCentre, browserCentre, .5);
    const toward = s.focus < 0 ? scribeCentre : browserCentre;
    target.lerpVectors(mid, toward, Math.abs(s.focus) * .22);
    target.lerp(browserCentre, s.push * .3);
    target.y = Math.max(0, target.y * .6);
    camera.position.copy(target).add(lookFrom);
    camera.lookAt(target);
    const h = fit.height / (1 + s.push * .32);
    camera.top = h / 2; camera.bottom = -h / 2;
    camera.left = -h * aspect / 2; camera.right = h * aspect / 2;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    renderer.render(scene, camera);
    projectLabel(labels.scribe, scribeAnchor);
    projectLabel(labels.laptop, laptopAnchor);
  };

  resize();

  return {
    render,
    resize,
    refreshTheme() {
      palette = readPalette(host);
      renderer.setClearColor(palette['surface']);
      ambient.color.set(palette['on-media']);
      sun.color.set(palette['on-media']);
      for (const m of [body, pad.material, barrel.material, nib.material]) m.color.set(palette['chassis']);
      base.material.color.set(palette['metal']);
      threadMat.color.set(palette['accent']);
      pulse.material.color.set(palette['accent']);
      paintDesk();
      deskTex.needsUpdate = true;
      paintKeys(palette, keysCanvas);
      keys.material.map!.needsUpdate = true;
      paintShadow(palette, shadowCanvas, 46, 26, 34);
      shadowTex.needsUpdate = true;
      painted = ''; // refresh both screens on the caller's single scheduled frame
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      thread.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      el.remove();
    },
  };
}

export type { Texture };
