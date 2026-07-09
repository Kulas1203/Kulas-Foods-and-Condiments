import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 450;
const BOUNDS = { x: 11, y: 7, z: 6 };
const CHILI = new THREE.Color('#e23a22');
const GOLD = new THREE.Color('#f0b45c');

// deterministic RNG keeps the field stable (and render-pure)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft round sprite so the dust motes glow instead of reading as squares. */
function makeDustTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Slow-rising red and gold "spice dust" filling the background with
 * atmospheric depth. Positions update on the CPU (450 points is cheap)
 * and wrap vertically so the drift never ends.
 */
export default function SpiceParticles() {
  const points = useRef();
  const dust = useMemo(() => makeDustTexture(), []);

  const { positions, colors, base, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 2); // base x/z for the sway
    const speeds = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);

    const rand = mulberry32(1337);
    for (let i = 0; i < COUNT; i++) {
      const x = (rand() - 0.5) * BOUNDS.x;
      const y = (rand() - 0.5) * BOUNDS.y;
      const z = (rand() - 0.5) * BOUNDS.z - 1.5;
      positions.set([x, y, z], i * 3);
      base.set([x, z], i * 2);
      speeds[i] = 0.12 + rand() * 0.3;
      phases[i] = rand() * Math.PI * 2;

      const c = rand() < 0.55 ? CHILI : GOLD;
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors, base, speeds, phases };
  }, []);

  useFrame((state, delta) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position.array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += speeds[i] * delta; // rise
      if (pos[i3 + 1] > BOUNDS.y / 2) pos[i3 + 1] = -BOUNDS.y / 2;
      // lazy sideways sway
      pos[i3] = base[i * 2] + Math.sin(t * 0.4 + phases[i]) * 0.35;
      pos[i3 + 2] = base[i * 2 + 1] + Math.cos(t * 0.3 + phases[i]) * 0.25;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={dust}
        size={0.09}
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
