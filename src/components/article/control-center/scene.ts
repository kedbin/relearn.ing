/**
 * Entry 069's control-center scene, drawn with Three.js and loaded lazily by ControlCenter.astro.
 * Like the Kindle studio, it never runs its own loop: the caller renders a state on demand,
 * so nothing is drawn while the figure is idle, offscreen or showing reduced motion.
 *
 * Each target has two routes: an outbound one (accent, arrow at the target) for the task and an
 * inbound one (eng, arrow at the phone) for the report. Tiles above the target show local work.
 */
import {
  AmbientLight, Box3, BufferGeometry, Color, ConeGeometry, DirectionalLight, Group, Line, LineBasicMaterial,
  LineDashedMaterial, Mesh, MeshBasicMaterial, MeshLambertMaterial, OrthographicCamera, QuadraticBezierCurve3,
  Scene, SphereGeometry, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { readPalette } from '../kindle/scene-palette';
import { LOCAL_STEPS, TARGETS, type Frame, type Mode, type TargetId } from './routes';

export interface CenterState { selected: TargetId; mode: Mode; frame: Frame | null; done: boolean }

export interface CenterScene {
  render(state: CenterState): void;
  refreshTheme(): void;
  resize(): void;
  dispose(): void;
}

export interface CenterLabels {
  phone?: HTMLElement;
  targets: Partial<Record<TargetId, HTMLElement>>;
  packet?: HTMLElement;
  work?: HTMLElement;
}

const MAX_TILES = Math.max(...Object.values(LOCAL_STEPS).map((s) => s.length));
const UP = new Vector3(0, 1, 0);

export function createCenter(host: HTMLElement, labels: CenterLabels): CenterScene {
  let palette = readPalette(host);
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color(palette['surface']), 1);
  const el = renderer.domElement;
  el.setAttribute('aria-hidden', 'true');
  el.classList.add('center-canvas');
  host.prepend(el);

  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, .1, 400);
  const ambient = new AmbientLight(palette['on-media'], 2);
  const sun = new DirectionalLight(palette['on-media'], 1.4);
  sun.position.set(-10, 24, 14);
  scene.add(ambient, sun);

  const chassis = keep(new MeshLambertMaterial({ color: palette['chassis'] }));
  const metal = keep(new MeshLambertMaterial({ color: palette['metal'] }));
  const screen = keep(new MeshBasicMaterial({ color: palette['bg'] }));
  const accent = keep(new MeshBasicMaterial({ color: palette['accent'] }));
  const eng = keep(new MeshBasicMaterial({ color: palette['eng'] }));

  // ── Phone: Termux + Pi, owner of context and approvals ────────────────
  const phone = new Group();
  const phoneBody = new Mesh(keep(new RoundedBoxGeometry(3.2, 6.2, .5, 4, .4)), chassis);
  const phoneScreen = new Mesh(keep(new RoundedBoxGeometry(2.7, 5.3, .05, 2, .12)), screen);
  phoneScreen.position.z = .27;
  const barGeo = keep(new RoundedBoxGeometry(1.6, .22, .04, 1, .05));
  const prompt = new Mesh(barGeo, accent);
  prompt.position.set(-.35, 1.9, .31);
  const inbox = new Mesh(barGeo, eng); // the report, once it lands
  inbox.position.set(-.1, 1.3, .31);
  inbox.scale.x = 1.3;
  phone.add(phoneBody, phoneScreen, prompt, inbox);
  scene.add(phone);

  // ── Targets ───────────────────────────────────────────────────────────
  const boxGeo = keep(new RoundedBoxGeometry(5.6, 1.2, 3.4, 3, .25));
  const lidGeo = keep(new RoundedBoxGeometry(5.6, 3.4, .22, 3, .12));
  const lidScreenGeo = keep(new RoundedBoxGeometry(5, 2.9, .04, 1, .05));
  const rackGeo = keep(new RoundedBoxGeometry(4.6, 1.05, 3, 3, .18));
  const ledGeo = keep(new SphereGeometry(.13, 12, 8));
  const tileGeo = keep(new RoundedBoxGeometry(.9, .32, .9, 2, .08));
  const coneGeo = keep(new ConeGeometry(.3, .8, 16));

  interface Route { curve: QuadraticBezierCurve3; line: Line; mat: LineDashedMaterial | LineBasicMaterial; arrow: Mesh; arrowMat: MeshBasicMaterial }
  interface Node { id: TargetId; group: Group; label: Vector3; port: Vector3; out: Route; back: Route; tiles: Mesh[]; tileMats: MeshBasicMaterial[]; top: number }

  const route = (proposed: boolean): Route => {
    const mat = keep(proposed
      ? new LineDashedMaterial({ color: palette['metal'], dashSize: .45, gapSize: .32, transparent: true })
      : new LineBasicMaterial({ color: palette['metal'], transparent: true }));
    const line = new Line(keep(new BufferGeometry()), mat);
    const arrowMat = keep(new MeshBasicMaterial({ color: palette['metal'], transparent: true }));
    const arrow = new Mesh(coneGeo, arrowMat);
    scene.add(line, arrow);
    return { curve: new QuadraticBezierCurve3(new Vector3(), new Vector3(), new Vector3()), line, mat, arrow, arrowMat };
  };

  const nodes: Node[] = TARGETS.map((t) => {
    const group = new Group();
    let top: number;
    if (t.kind === 'laptop') {
      const base = new Mesh(boxGeo, chassis);
      base.scale.y = .35;
      const lid = new Mesh(lidGeo, chassis);
      lid.position.set(0, 1.75, -1.6);
      lid.rotation.x = -.18;
      const lidScreen = new Mesh(lidScreenGeo, screen);
      lidScreen.position.set(0, 1.75, -1.47);
      lidScreen.rotation.x = -.18;
      group.add(base, lid, lidScreen);
      top = 4.1;
    } else {
      for (let i = 0; i < 2; i++) {
        const unit = new Mesh(rackGeo, i ? metal : chassis);
        unit.position.y = i * 1.2;
        const led = new Mesh(ledGeo, accent);
        led.position.set(1.8, i * 1.2, 1.52);
        group.add(unit, led);
      }
      top = 2.4;
    }
    const tiles: Mesh[] = [], tileMats: MeshBasicMaterial[] = [];
    for (let i = 0; i < MAX_TILES; i++) {
      const m = keep(new MeshBasicMaterial({ color: palette['metal'] }));
      const tile = new Mesh(tileGeo, m);
      tile.position.set((i - (MAX_TILES - 1) / 2) * 1.15, top, 0);
      group.add(tile);
      tiles.push(tile); tileMats.push(m);
    }
    scene.add(group);
    const proposed = t.status === 'proposed';
    return { id: t.id, group, label: new Vector3(), port: new Vector3(), out: route(proposed), back: route(proposed), tiles, tileMats, top };
  });

  const packetMat = keep(new MeshBasicMaterial({ color: palette['accent'] }));
  const haloMat = keep(new MeshBasicMaterial({ color: palette['accent'], transparent: true, opacity: .22, depthWrite: false }));
  const packet = new Mesh(keep(new SphereGeometry(.36, 18, 12)), packetMat);
  packet.add(new Mesh(keep(new SphereGeometry(.68, 18, 12)), haloMat));
  scene.add(packet);

  // ── Layout: phone on the left, targets stacked on the right ──────────
  const size = { w: 1, h: 1 };
  const fit = { w: 31, h: 17 };
  const phoneAnchor = new Vector3();
  const tmp = new Vector3();
  const dir = new Vector3();

  const setRoute = (r: Route, a: Vector3, b: Vector3, lift: Vector3, arrowAtEnd: boolean) => {
    r.curve.v0.copy(a);
    r.curve.v2.copy(b);
    r.curve.v1.lerpVectors(a, b, .5).add(lift);
    // Stop the line short of the arrowhead so the tip stays crisp.
    const pts = r.curve.getPoints(48);
    const cut = 3;
    r.line.geometry.setFromPoints(arrowAtEnd ? pts.slice(0, pts.length - cut) : pts.slice(cut));
    r.line.computeLineDistances();
    const at = arrowAtEnd ? .97 : .03;
    r.curve.getPoint(at, r.arrow.position);
    r.curve.getTangent(at, dir);
    if (!arrowAtEnd) dir.negate();
    r.arrow.quaternion.setFromUnitVectors(UP, dir.normalize());
    r.arrow.scale.set(1, .9, 1);
  };

  const layout = () => {
    const narrow = size.w < 520;
    fit.w = narrow ? 29 : 31; fit.h = 17;
    phone.position.set(-11, 2, 0);
    phone.rotation.set(-.35, .45, 0);
    phoneAnchor.set(-9.3, 1.6, 0);
    nodes.forEach((n, i) => {
      const z = i === 0 ? -4.6 : 4.6;
      n.group.position.set(narrow ? 6.6 : 6.2, 0, z);
      n.group.scale.setScalar(narrow ? .92 : 1);
      n.port.set(n.group.position.x - 3.3, .9, z);
      const a = phoneAnchor, b = n.port;
      // Outbound arcs high, inbound runs low and in front: two lanes, never drawn on top of each other.
      setRoute(n.out, tmp.copy(a).add(new Vector3(0, .55, -.35)).clone(), b.clone().add(new Vector3(0, .55, -.45)), new Vector3(0, 2.6, -1.1), true);
      setRoute(n.back, tmp.copy(a).add(new Vector3(0, -.45, .45)).clone(), b.clone().add(new Vector3(0, -.35, .55)), new Vector3(0, .4, 1.2), false);
      n.label.copy(n.group.position).add(new Vector3(3.3, 0, 1.4));
    });
  };

  const resize = () => {
    const r = host.getBoundingClientRect();
    size.w = Math.max(1, r.width); size.h = Math.max(1, r.height);
    renderer.setSize(size.w, size.h, false);
    layout();
    // Fit the frustum to what is actually drawn, with room on the right for the target tags.
    camera.position.set(0, 40, 34);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const box = new Box3();
    scene.updateMatrixWorld(true);
    box.expandByObject(phone);
    for (const n of nodes) { box.expandByObject(n.group); box.expandByObject(n.out.line); box.expandByObject(n.back.line); }
    const lo = new Vector3(Infinity, Infinity, 0), hi = new Vector3(-Infinity, -Infinity, 0);
    for (let i = 0; i < 8; i++) {
      tmp.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).applyMatrix4(camera.matrixWorldInverse);
      lo.min(tmp); hi.max(tmp);
    }
    const tagRoom = fit.w * (size.w < 520 ? .2 : .13);
    hi.x += tagRoom;
    const pad = .06 * (hi.x - lo.x);
    const cx = (lo.x + hi.x) / 2, cy = (lo.y + hi.y) / 2;
    const aspect = size.w / size.h;
    const h = Math.max(hi.y - lo.y + pad * 2, (hi.x - lo.x + pad * 2) / aspect);
    camera.top = cy + h / 2; camera.bottom = cy - h / 2;
    camera.left = cx - h * aspect / 2; camera.right = cx + h * aspect / 2;
    camera.updateProjectionMatrix();
  };

  /** Pin an HTML tag to a world point. align 'start' puts the tag's left edge there. */
  const place = (label: HTMLElement | undefined, at: Vector3, show = true, align: 'center' | 'start' = 'center') => {
    if (!label) return;
    label.hidden = !show;
    if (!show) return;
    const v = tmp.copy(at).project(camera);
    const w = label.offsetWidth, h = label.offsetHeight;
    const px = (v.x + 1) / 2 * size.w;
    const x = Math.min(size.w - w - 6, Math.max(6, align === 'start' ? px : px - w / 2));
    const y = Math.min(size.h - h - 6, Math.max(6, (1 - v.y) / 2 * size.h - h / 2));
    label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };

  const paintRoute = (r: Route, inbound: boolean, on: boolean) => {
    if (!on) { r.mat.color.set(palette['metal']); r.arrowMat.color.set(palette['metal']); }
    else if (inbound) { r.mat.color.set(palette['eng']); r.arrowMat.color.set(palette['eng']); }
    else { r.mat.color.set(palette['accent']); r.arrowMat.color.set(palette['accent']); }
    r.mat.opacity = on ? 1 : .55;
    r.arrowMat.opacity = on ? 1 : .55;
  };

  const render = (s: CenterState) => {
    const f = s.frame;
    const tiles = LOCAL_STEPS[s.mode].length;
    for (const n of nodes) {
      const on = n.id === s.selected;
      paintRoute(n.out, false, on);
      paintRoute(n.back, true, on);
      n.group.position.y = on ? .3 : 0;
      n.tiles.forEach((tile, i) => {
        tile.visible = on && i < tiles;
        const done = s.done || (f ? i < f.step : false);
        const now = !!f && f.kind === 'local' && i === f.step;
        const m = n.tileMats[i];
        if (done) m.color.set(palette['eng']);
        else if (now) m.color.set(palette['accent']);
        else m.color.set(palette['metal']);
        tile.position.y = n.top + (now ? .35 : 0);
      });
    }
    inbox.visible = s.done || (!!f && f.kind === 'back' && f.u < .08);

    const sel = nodes.find((n) => n.id === s.selected)!;
    packet.visible = !!f?.packet;
    if (f?.packet) {
      const r = f.kind === 'out' ? sel.out : sel.back;
      r.curve.getPoint(f.u, packet.position);
      if (f.kind === 'out') { packetMat.color.set(palette['accent']); haloMat.color.set(palette['accent']); }
      else { packetMat.color.set(palette['eng']); haloMat.color.set(palette['eng']); }
    }
    renderer.render(scene, camera);

    place(labels.phone, tmp.copy(phoneAnchor).add(new Vector3(-1.6, -3.9, 2.4)));
    for (const n of nodes) place(labels.targets[n.id], n.label, true, 'start');
    const tileTop = sel.group.position.clone().add(new Vector3((MAX_TILES / 2) * 1.15 + .2, sel.top + .3, 0));
    place(labels.work, tileTop, !!f && f.kind === 'local', 'start');
    // Near the phone the phone's own tag takes over, so the packet tag steps aside.
    if (f?.packet && f.u > .22) place(labels.packet, packet.position.clone().add(new Vector3(0, f.kind === 'out' ? 1.6 : -1.3, f.kind === 'out' ? -.6 : 1.2)));
    else if (labels.packet) labels.packet.hidden = true;
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
      chassis.color.set(palette['chassis']);
      metal.color.set(palette['metal']);
      screen.color.set(palette['bg']);
      accent.color.set(palette['accent']);
      eng.color.set(palette['eng']);
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      el.remove();
    },
  };
}
