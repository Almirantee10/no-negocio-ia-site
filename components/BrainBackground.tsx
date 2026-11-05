"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reduced } from "@/lib/gsap";
import { brain } from "@/lib/brainState";

/* ------------------------------------------------------------------ */
/*  Geometria: cérebro (perfil) feito de nós + sinapses                */
/* ------------------------------------------------------------------ */
function mulberry(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function build() {
  const rnd = mulberry(7);
  const pts: number[] = [];
  const groups: number[] = []; // 0 cérebro, 1 cerebelo, 2 tronco

  // x = frente(+)/trás(-), y = cima, z = lateral
  const gyri = (x: number, y: number, z: number) =>
    Math.sin(6.2 * x + 1.7 * Math.sin(4.1 * y + 1.3 * z)) *
      Math.sin(5.3 * z + 2.1 * Math.sin(3.6 * x - y)) * 0.6 +
    Math.sin(9.5 * y + 2.2 * Math.sin(5 * x + 2 * z)) * 0.4;

  // Cérebro (cerebrum)
  const N = 1500;
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const dy = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - dy * dy);
    const th = ga * i;
    const dx = Math.cos(th) * r;
    const dz = Math.sin(th) * r;
    let x = dx * 1.0;
    let y = dy * 0.74;
    let z = dz * 0.66;
    if (dy < 0) y *= 0.6;
    y *= 1 + 0.1 * dx;
    // fissura longitudinal
    if (dy > 0) y -= 0.12 * Math.exp(-Math.pow(dz / 0.14, 2)) * dy;
    z += Math.sign(dz) * 0.03;
    // lobo temporal
    if (dy < 0.05) {
      const k = Math.exp(-Math.pow((dx - 0.22) / 0.5, 2)) * Math.min(1, Math.abs(dz) * 1.6);
      y -= 0.2 * k * (1 - dy);
    }
    // sulcos / giros
    const f = 1 + 0.055 * gyri(x, y, z);
    x *= f; y *= f; z *= f;
    x += (rnd() - 0.5) * 0.02; y += (rnd() - 0.5) * 0.02; z += (rnd() - 0.5) * 0.02;
    pts.push(x, y, z); groups.push(0);
  }
  // Cerebelo
  for (let i = 0; i < 260; i++) {
    const dy = 1 - (i / 259) * 2;
    const r = Math.sqrt(1 - dy * dy);
    const th = ga * i;
    let x = -0.62 + Math.cos(th) * r * 0.34;
    let y = -0.52 + dy * 0.2;
    let z = Math.sin(th) * r * 0.34;
    y += 0.025 * Math.sin(y * 70);
    pts.push(x, y, z); groups.push(1);
  }
  // Tronco encefálico
  for (let i = 0; i < 40; i++) {
    const t = i / 39;
    const a = rnd() * Math.PI * 2;
    const rr = 0.07 * (1 - t * 0.2);
    pts.push(-0.32 - t * 0.12 + Math.cos(a) * rr * 0.6, -0.5 - t * 0.55, Math.sin(a) * rr);
    groups.push(2);
  }

  const n = pts.length / 3;
  const pos = Float32Array.from(pts);

  // Sinapses: k vizinhos mais próximos
  const edgeSet = new Set<number>();
  const ea: number[] = [], eb: number[] = [];
  for (let i = 0; i < n; i++) {
    const best: [number, number][] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = pos[i * 3] - pos[j * 3], dy = pos[i * 3 + 1] - pos[j * 3 + 1], dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (best.length < 3 || d < best[best.length - 1][0]) {
        best.push([d, j]); best.sort((a, b) => a[0] - b[0]); if (best.length > 3) best.pop();
      }
    }
    for (const [d, j] of best) {
      if (d > 0.09 * 0.09 * 4) continue;
      const a = Math.min(i, j), b = Math.max(i, j), key = a * n + b;
      if (edgeSet.has(key)) continue;
      edgeSet.add(key); ea.push(a); eb.push(b);
    }
  }
  // algumas conexões longas (axônios) entre cérebro e cerebelo / hemisférios
  for (let c = 0; c < 36; c++) {
    const a = Math.floor(rnd() * N), b = Math.floor(rnd() * N);
    const dx = pos[a * 3] - pos[b * 3], dy = pos[a * 3 + 1] - pos[b * 3 + 1], dz = pos[a * 3 + 2] - pos[b * 3 + 2];
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d > 0.35 && d < 0.9) { ea.push(Math.min(a, b)); eb.push(Math.max(a, b)); }
  }
  const adj: number[][] = Array.from({ length: n }, () => []);
  ea.forEach((a, e) => { adj[a].push(e); adj[eb[e]].push(e); });
  return { pos, n, ea: Uint32Array.from(ea), eb: Uint32Array.from(eb), adj, groups };
}

/* ------------------------------------------------------------------ */
/*  Componente                                                         */
/* ------------------------------------------------------------------ */
type Pulse = { e: number; from: number; t: number; speed: number; life: number };
type Inbound = { sx: number; sy: number; sz: number; target: number; t: number; speed: number };

export default function BrainBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const g = build();
    const { pos, n, ea, eb, adj } = g;
    const E = ea.length;
    const isReduced = reduced();

    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    // estado por frame
    const sx = new Float32Array(n), sy = new Float32Array(n), sz = new Float32Array(n);
    const flash = new Float32Array(n);
    const edgeBucket = new Uint8Array(E);
    const pulses: Pulse[] = [];
    const inbound: Inbound[] = [];
    const waves: { dist: Int16Array; t0: number }[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let boost = 0, lastWave = 0, vel = 0;

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // entrada
    brain.opacity = 0; brain.scale = 1; brain.yaw = 0; brain.x = 0; brain.y = 0; brain.energy = 1;
    const intro = { reveal: 0 };
    const ctxG = gsap.context(() => {
      if (isReduced) { intro.reveal = 1; brain.opacity = 1; return; }
      gsap.to(intro, { reveal: 1, duration: 2.6, ease: "power3.out", delay: 0.15 });
      gsap.to(brain, { opacity: 1, duration: 1.8, ease: "power2.out", delay: 0.1 });

      // O cérebro acompanha o scroll
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 1.4 },
      });
      tl.to(brain, { yaw: 0.8, x: -0.2, scale: 1.05, energy: 1.2, duration: 1 })
        .to(brain, { yaw: 1.7, x: 0.16, scale: 0.95, y: 0.02, energy: 1, duration: 1 })
        .to(brain, { yaw: 2.6, x: 0, scale: 1.3, y: 0, energy: 1.8, duration: 1.2 })
        .to(brain, { yaw: 3.4, x: -0.2, scale: 1.05, energy: 1.4, duration: 1 })
        .to(brain, { yaw: 4.1, x: 0.05, scale: 1.15, energy: 1.5, duration: 1 });

      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => { vel = self.getVelocity(); },
      });
    });

    // helpers
    const spawnPulse = (from?: number) => {
      const node = from ?? Math.floor(Math.random() * n);
      const list = adj[node];
      if (!list.length) return;
      pulses.push({ e: list[Math.floor(Math.random() * list.length)], from: node, t: 0, speed: 0.9 + Math.random() * 1.6, life: 6 + Math.floor(Math.random() * 14) });
    };
    const spawnInbound = () => {
      const a = Math.random() * Math.PI * 2, b = (Math.random() - 0.5) * 1.6, R = 2.4 + Math.random() * 1.2;
      let target = Math.floor(Math.random() * n);
      inbound.push({ sx: Math.cos(a) * R, sy: Math.sin(b) * R * 0.8, sz: Math.sin(a) * R, target, t: 0, speed: 0.22 + Math.random() * 0.3 });
    };
    const startWave = (now: number) => {
      const start = Math.floor(Math.random() * n);
      const dist = new Int16Array(n).fill(-1);
      const q = [start]; dist[start] = 0;
      for (let h = 0; h < q.length; h++) {
        const u = q[h];
        for (const e of adj[u]) {
          const v = ea[e] === u ? eb[e] : ea[e];
          if (dist[v] < 0) { dist[v] = dist[u] + 1; q.push(v); }
        }
      }
      waves.push({ dist, t0: now });
      if (waves.length > 2) waves.shift();
    };

    const rot = { cy: 1, sy: 0 };
    const LINE = [0.045, 0.08, 0.15]; // alfa por profundidade (fundo claro)
    const LINE_DARK = [0.04, 0.08, 0.16];
    const darkEl = document.getElementById("como-funciona");

    let raf = 0, last = performance.now(), time = 0;

    const frame = (nowMs: number) => {
      const dt = Math.min((nowMs - last) / 1000, 0.05);
      last = nowMs;
      if (!isReduced) time += dt;
      const now = time;

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      boost += (Math.min(Math.abs(vel) / 1800, 2.5) - boost) * 0.08;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (brain.opacity <= 0.001) { raf = requestAnimationFrame(frame); return; }

      const wide = W > 900;
      const baseX = wide ? 0.63 : 0.5;
      const cx = W * (baseX + brain.x * (wide ? 1 : 0.4));
      const cy = H * (0.5 + brain.y);
      const S = (wide ? Math.min(H * 0.5, W * 0.33) : Math.min(W * 0.5, H * 0.32)) * brain.scale * (0.7 + 0.3 * intro.reveal);

      // rotação: balanço lento + scroll + mouse
      const yaw = Math.sin(now * 0.16) * 0.5 + 0.15 + brain.yaw + mouse.x * 0.28 + now * 0.01;
      const pitch = -0.12 + mouse.y * 0.1 + Math.sin(now * 0.11) * 0.05;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const CAM = 3.4;

      for (let i = 0; i < n; i++) {
        let x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
        // respiração suave
        const br = 1 + 0.012 * Math.sin(now * 1.1 + x * 3);
        x *= br; y *= br; z *= br;
        const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
        const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        const k = CAM / (CAM - z2);
        sx[i] = cx + x1 * S * k; sy[i] = cy - y2 * S * k; sz[i] = z2;
        if (flash[i] > 0) flash[i] = Math.max(0, flash[i] - dt * 1.4);
      }

      // ondas de ativação
      if (!isReduced) {
        if (now - lastWave > 3.2 / Math.max(brain.energy, 0.6)) { startWave(now); lastWave = now; }
        for (const w of waves) {
          const el = (now - w.t0) / 0.05;
          const d = w.dist;
          for (let i = 0; i < n; i++) if (d[i] >= 0 && d[i] <= el && d[i] > el - 2) flash[i] = Math.max(flash[i], 0.85);
        }
      }

      // região escura (seção "Como funciona")
      let dTop = -1, dBot = -1;
      if (darkEl) {
        const r = darkEl.getBoundingClientRect();
        if (r.bottom > 0 && r.top < H) { dTop = Math.max(r.top, 0); dBot = Math.min(r.bottom, H); }
      }
      const regions: { y0: number; y1: number; dark: boolean }[] = dTop < 0
        ? [{ y0: 0, y1: H, dark: false }]
        : [{ y0: 0, y1: dTop, dark: false }, { y0: dTop, y1: dBot, dark: true }, { y0: dBot, y1: H, dark: false }];

      const globalA = brain.opacity * intro.reveal;

      // ------- arestas -------
      const paths = [new Path2D(), new Path2D(), new Path2D()];
      for (let e = 0; e < E; e++) {
        const a = ea[e], b = eb[e];
        const d = (sz[a] + sz[b]) * 0.5;
        const bk = d < -0.25 ? 0 : d < 0.3 ? 1 : 2;
        edgeBucket[e] = bk;
        paths[bk].moveTo(sx[a], sy[a]); paths[bk].lineTo(sx[b], sy[b]);
      }
      ctx.lineWidth = 1;
      for (const r of regions) {
        if (r.y1 - r.y0 <= 0) continue;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, r.y0, W, r.y1 - r.y0); ctx.clip();
        for (let b = 0; b < 3; b++) {
          ctx.strokeStyle = r.dark ? `rgba(247,246,242,${LINE_DARK[b] * globalA})` : `rgba(20,20,20,${LINE[b] * globalA})`;
          ctx.stroke(paths[b]);
        }
        ctx.restore();
      }

      // ------- nós -------
      const nb = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      for (let i = 0; i < n; i++) {
        const d = Math.min(1, Math.max(0, (sz[i] + 1) / 2));
        const bk = Math.min(3, Math.floor(d * 4));
        const rr = 0.8 + d * 1.5;
        nb[bk].moveTo(sx[i] + rr, sy[i]); nb[bk].arc(sx[i], sy[i], rr, 0, 6.2832);
      }
      const NA = [0.1, 0.17, 0.28, 0.4];
      for (const r of regions) {
        if (r.y1 - r.y0 <= 0) continue;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, r.y0, W, r.y1 - r.y0); ctx.clip();
        for (let b = 0; b < 4; b++) {
          ctx.fillStyle = r.dark ? `rgba(247,246,242,${NA[b] * globalA * 1.1})` : `rgba(20,20,20,${NA[b] * globalA * 0.9})`;
          ctx.fill(nb[b]);
        }
        ctx.restore();
      }

      // nós ativos (flash)
      for (let i = 0; i < n; i++) {
        const f = flash[i];
        if (f <= 0.02) continue;
        const d = Math.min(1, Math.max(0, (sz[i] + 1) / 2));
        ctx.fillStyle = `rgba(255,107,26,${0.09 * f * globalA})`;
        ctx.beginPath(); ctx.arc(sx[i], sy[i], (4 + 5 * f) * (0.7 + d * 0.6), 0, 6.2832); ctx.fill();
        ctx.fillStyle = `rgba(255,107,26,${Math.min(1, f * 1.1) * globalA})`;
        ctx.beginPath(); ctx.arc(sx[i], sy[i], (1.4 + 1.6 * f) * (0.8 + d * 0.5), 0, 6.2832); ctx.fill();
      }

      if (!isReduced) {
        // ------- pulsos de dados viajando pelas sinapses -------
        const target = Math.round(46 * brain.energy * (1 + boost * 0.5));
        while (pulses.length < target) spawnPulse();
        ctx.lineCap = "round";
        for (let p = pulses.length - 1; p >= 0; p--) {
          const pu = pulses[p];
          pu.t += dt * pu.speed * (1 + boost * 0.6) * 2.2;
          const a = pu.from, b = ea[pu.e] === a ? eb[pu.e] : ea[pu.e];
          if (pu.t >= 1) {
            flash[b] = Math.max(flash[b], 0.7);
            pu.life--;
            if (pu.life <= 0 || pulses.length > target + 8) { pulses.splice(p, 1); continue; }
            const opts = adj[b].filter((e) => e !== pu.e);
            const list = opts.length ? opts : adj[b];
            pu.from = b; pu.e = list[Math.floor(Math.random() * list.length)]; pu.t = 0;
            continue;
          }
          const t = pu.t;
          const x = sx[a] + (sx[b] - sx[a]) * t, y = sy[a] + (sy[b] - sy[a]) * t;
          const t0 = Math.max(0, t - 0.7);
          const tx = sx[a] + (sx[b] - sx[a]) * t0, ty = sy[a] + (sy[b] - sy[a]) * t0;
          ctx.strokeStyle = `rgba(255,107,26,${0.8 * globalA})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
          ctx.fillStyle = `rgba(255,107,26,${0.22 * globalA})`;
          ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.2832); ctx.fill();
          ctx.fillStyle = `rgba(255,107,26,${globalA})`;
          ctx.beginPath(); ctx.arc(x, y, 2, 0, 6.2832); ctx.fill();
        }

        // ------- dados entrando no cérebro -------
        const inTarget = Math.round(26 * brain.energy);
        while (inbound.length < inTarget) spawnInbound();
        for (let q = inbound.length - 1; q >= 0; q--) {
          const ib = inbound[q];
          ib.t += dt * ib.speed * (1 + boost * 0.5);
          if (ib.t >= 1) {
            flash[ib.target] = 1; spawnPulse(ib.target); inbound.splice(q, 1); continue;
          }
          const te = ib.t * ib.t * (3 - 2 * ib.t);
          const tn = ib.target;
          // posição no espaço 3D (usa a mesma rotação)
          const ix = pos[tn * 3] + (ib.sx - pos[tn * 3]) * (1 - te);
          const iy = pos[tn * 3 + 1] + (ib.sy - pos[tn * 3 + 1]) * (1 - te);
          const iz = pos[tn * 3 + 2] + (ib.sz - pos[tn * 3 + 2]) * (1 - te);
          const x1 = ix * cyw + iz * syw, z1 = -ix * syw + iz * cyw;
          const y2 = iy * cp - z1 * sp, z2 = iy * sp + z1 * cp;
          const k = CAM / (CAM - z2);
          const px = cx + x1 * S * k, py = cy - y2 * S * k;
          const al = Math.sin(Math.PI * ib.t) * globalA;
          ctx.fillStyle = `rgba(255,107,26,${0.9 * al})`;
          ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
          ctx.strokeStyle = `rgba(255,107,26,${0.25 * al})`;
          ctx.lineWidth = 1;
          const bx = sx[tn] + (px - sx[tn]) * 1.0;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + (px - sx[tn]) * 0.06, py + (py - sy[tn]) * 0.06); ctx.stroke();
          void bx;
        }
      }
      if (!isReduced) raf = requestAnimationFrame(frame);
    };

    if (isReduced) {
      const draw = () => frame(performance.now());
      draw();
      window.addEventListener("resize", draw);
    } else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      ctxG.revert();
    };
  }, []);

  return (
    <div className="brain-bg" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
