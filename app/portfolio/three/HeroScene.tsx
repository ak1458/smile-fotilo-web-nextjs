'use client';
import { useEffect, useRef } from 'react';

// Lightweight WebGL hero: a slowly rotating wireframe monolith + drifting particles,
// tinted by the page --accent. Loaded only on capable desktops (dynamic, ssr:false).
export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let raf = 0;

    const accentStr =
      getComputedStyle(canvas.closest('[class*="aurora"]') || document.documentElement)
        .getPropertyValue('--accent')
        .trim() || '#3D7BFF';

    let cleanup = () => {};

    import('three')
      .then((THREE) => {
        if (disposed) return;
        const accent = new THREE.Color(accentStr || '#3D7BFF');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setClearColor(0x000000, 0);

        // monolith: icosahedron wireframe
        const geo = new THREE.IcosahedronGeometry(2.2, 1);
        const mat = new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.5 });
        const mesh = new THREE.Mesh(geo, mat);
        const inner = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.5, 0),
          new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.08 }),
        );
        scene.add(mesh, inner);

        // particle field
        const COUNT = 380;
        const positions = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 22;
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({ color: accent, size: 0.03, transparent: true, opacity: 0.7 });
        const points = new THREE.Points(pGeo, pMat);
        scene.add(points);

        let mx = 0;
        let my = 0;
        const onMove = (e: MouseEvent) => {
          mx = (e.clientX / innerWidth - 0.5) * 0.6;
          my = (e.clientY / innerHeight - 0.5) * 0.6;
        };
        addEventListener('mousemove', onMove, { passive: true });

        const resize = () => {
          const w = canvas.clientWidth || innerWidth;
          const h = canvas.clientHeight || innerHeight;
          renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        addEventListener('resize', resize);

        let visible = true;
        const io = new IntersectionObserver((entries) => {
          visible = entries[0]?.isIntersecting ?? true;
        });
        io.observe(canvas);

        const clock = new THREE.Clock();
        const loop = () => {
          raf = requestAnimationFrame(loop);
          if (!visible || document.hidden) return;
          const t = clock.getElapsedTime();
          mesh.rotation.y = t * 0.18;
          mesh.rotation.x = t * 0.08;
          inner.rotation.y = -t * 0.26;
          points.rotation.y = t * 0.04;
          camera.position.x += (mx * 2 - camera.position.x) * 0.04;
          camera.position.y += (-my * 2 - camera.position.y) * 0.04;
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
        };
        loop();

        cleanup = () => {
          cancelAnimationFrame(raf);
          removeEventListener('mousemove', onMove);
          removeEventListener('resize', resize);
          io.disconnect();
          geo.dispose();
          mat.dispose();
          inner.geometry.dispose();
          (inner.material as { dispose: () => void }).dispose();
          pGeo.dispose();
          pMat.dispose();
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
