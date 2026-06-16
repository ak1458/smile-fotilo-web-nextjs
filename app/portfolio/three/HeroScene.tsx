'use client';
import { useEffect, useRef } from 'react';

// Faithful port of the AURORA mockup "monolith" hero scene (scene.js):
// metallic floating slabs with accent edges, titanium studio environment,
// accent/cyan lights, cursor parallax. Loaded only on capable desktops.
export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    Promise.all([import('three'), import('three/addons/environments/RoomEnvironment.js')])
      .then(([THREE, { RoomEnvironment }]) => {
        if (disposed) return;

        const accentStr =
          getComputedStyle(canvas.closest('[class*="aurora"]') || document.documentElement)
            .getPropertyValue('--accent')
            .trim() || '#3D7BFF';
        const accent = () => new THREE.Color(accentStr);
        const cyan = () => new THREE.Color('#22D3EE');

        let renderer: import('three').WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        } catch {
          canvas.style.background = `radial-gradient(60% 70% at 60% 30%, ${accentStr}40, transparent 60%), #050505`;
          return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.032);
        try {
          const pmrem = new THREE.PMREMGenerator(renderer);
          scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        } catch {
          /* env optional */
        }

        const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
        camera.position.set(0, 0, 12);

        scene.add(new THREE.AmbientLight(0xffffff, 0.25));
        const keyLight = new THREE.PointLight(accent(), 70, 60);
        keyLight.position.set(-8, 6, 8);
        const fillLight = new THREE.PointLight(cyan(), 35, 60);
        fillLight.position.set(9, -4, 6);
        const rim = new THREE.DirectionalLight(0xffffff, 0.6);
        rim.position.set(2, 8, -6);
        scene.add(keyLight, fillLight, rim);

        const world = new THREE.Group();
        scene.add(world);

        const slabMat = new THREE.MeshStandardMaterial({ color: 0x0d0d12, metalness: 0.78, roughness: 0.28 });
        const slabs = [
          { w: 2.6, h: 8.2, d: 0.7, x: 0, z: 0, ry: 0 },
          { w: 1.5, h: 6.2, d: 0.5, x: -3.1, z: -1.6, ry: 0.3 },
          { w: 1.2, h: 5.0, d: 0.5, x: 3.0, z: -1.2, ry: -0.25 },
          { w: 0.9, h: 4.0, d: 0.4, x: -1.4, z: 2.2, ry: 0.15 },
          { w: 0.8, h: 3.2, d: 0.4, x: 1.7, z: 2.6, ry: -0.2 },
        ];
        const disposables: Array<{ dispose: () => void }> = [slabMat];
        const floats: Array<{ mesh: import('three').Mesh; edges: import('three').LineSegments; sp: number; amp: number; ph: number }> = [];

        slabs.forEach((s, i) => {
          const geo = new THREE.BoxGeometry(s.w, s.h, s.d);
          const m = new THREE.Mesh(geo, slabMat);
          m.position.set(s.x, Math.sin(i) * 0.3, s.z);
          m.rotation.y = s.ry;
          const edgeGeo = new THREE.EdgesGeometry(geo);
          const edgeMat = new THREE.LineBasicMaterial({ color: accent(), transparent: true, opacity: 0.5 });
          const edges = new THREE.LineSegments(edgeGeo, edgeMat);
          edges.position.copy(m.position);
          edges.rotation.copy(m.rotation);
          world.add(m, edges);
          disposables.push(geo, edgeGeo, edgeMat);
          floats.push({ mesh: m, edges, sp: 0.4 + i * 0.12, amp: 0.18 + i * 0.05, ph: i });
        });

        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        const onMove = (e: PointerEvent) => {
          mouse.tx = (e.clientX / innerWidth) * 2 - 1;
          mouse.ty = (e.clientY / innerHeight) * 2 - 1;
        };
        addEventListener('pointermove', onMove, { passive: true });

        const resize = () => {
          const w = canvas.clientWidth || innerWidth;
          const h = canvas.clientHeight || innerHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        let visible = true;
        let vf = 0;
        let raf = 0;
        const clock = new THREE.Clock();
        const animate = () => {
          raf = requestAnimationFrame(animate);
          if ((vf++ & 7) === 0) {
            const r = canvas.getBoundingClientRect();
            visible = r.bottom > 0 && r.top < innerHeight;
          }
          if (!visible || document.hidden) return;
          const t = clock.getElapsedTime();
          mouse.x = lerp(mouse.x, mouse.tx, 0.05);
          mouse.y = lerp(mouse.y, mouse.ty, 0.05);
          camera.position.x = lerp(camera.position.x, mouse.x * 2.4, 0.06);
          camera.position.y = lerp(camera.position.y, -mouse.y * 1.5 + Math.sin(t * 0.3) * 0.2, 0.06);
          camera.lookAt(0, 0, 0);
          world.rotation.y = lerp(world.rotation.y, mouse.x * 0.35, 0.04) + 0.0008;
          floats.forEach((f) => {
            f.mesh.position.y = Math.sin(t * f.sp + f.ph) * f.amp;
            f.edges.position.y = f.mesh.position.y;
          });
          keyLight.position.x = lerp(keyLight.position.x, -8 + mouse.x * 4, 0.05);
          fillLight.position.y = lerp(fillLight.position.y, -4 - mouse.y * 3, 0.05);
          renderer.render(scene, camera);
        };
        animate();

        cleanup = () => {
          cancelAnimationFrame(raf);
          removeEventListener('pointermove', onMove);
          ro.disconnect();
          disposables.forEach((d) => d.dispose());
          renderer.dispose();
        };
      })
      .catch(() => {});

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <canvas id="hero-canvas" ref={canvasRef} aria-hidden="true" />;
}
