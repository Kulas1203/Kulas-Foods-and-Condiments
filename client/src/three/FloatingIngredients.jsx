import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// deterministic RNG so the arrangement is stable across reloads
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A curved capsule chili: tube along a bent curve, capped ends, green stem. */
function Chili() {
  const { curve, tip } = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0.36, 0),
      new THREE.Vector3(0.09, 0.12, 0.02),
      new THREE.Vector3(0.17, -0.14, 0.05),
      new THREE.Vector3(0.09, -0.38, 0.11),
    ];
    return { curve: new THREE.CatmullRomCurve3(pts), tip: pts[pts.length - 1] };
  }, []);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 24, 0.085, 12, false]} />
        <meshStandardMaterial color="#c21807" roughness={0.35} />
      </mesh>
      {/* capsule end caps */}
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.086, 12, 12]} />
        <meshStandardMaterial color="#c21807" roughness={0.35} />
      </mesh>
      <mesh position={tip.toArray()}>
        <sphereGeometry args={[0.086, 12, 12]} />
        <meshStandardMaterial color="#a91405" roughness={0.4} />
      </mesh>
      {/* stem */}
      <mesh position={[0, 0.47, 0]} rotation={[0.25, 0, -0.2]}>
        <cylinderGeometry args={[0.02, 0.045, 0.2, 8]} />
        <meshStandardMaterial color="#3e7c2f" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** A teardrop garlic clove built with a lathe profile. */
function Garlic() {
  const points = useMemo(
    () => [
      new THREE.Vector2(0.001, -0.22),
      new THREE.Vector2(0.1, -0.2),
      new THREE.Vector2(0.17, -0.08),
      new THREE.Vector2(0.16, 0.05),
      new THREE.Vector2(0.09, 0.17),
      new THREE.Vector2(0.04, 0.25),
      new THREE.Vector2(0.02, 0.31),
      new THREE.Vector2(0.001, 0.33),
    ],
    []
  );

  return (
    <mesh scale={[0.92, 1, 1]}>
      <latheGeometry args={[points, 22]} />
      <meshStandardMaterial color="#f2e8d5" roughness={0.55} />
    </mesh>
  );
}

function OrbitingRing({ count, radius, speed, seed, children: Item, yRange }) {
  const ring = useRef();

  const items = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + rand() * 0.7,
      radius: radius + rand() * 0.8,
      y: yRange[0] + rand() * (yRange[1] - yRange[0]),
      scale: 0.85 + rand() * 0.5,
      rotation: [rand() * Math.PI, rand() * Math.PI * 2, rand() * Math.PI],
      floatSpeed: 0.8 + rand() * 0.8,
    }));
  }, [count, radius, seed, yRange]);

  useFrame((state) => {
    if (ring.current) {
      ring.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <group ref={ring}>
      {items.map((it, i) => (
        <group
          key={i}
          position={[
            Math.cos(it.angle) * it.radius,
            it.y,
            Math.sin(it.angle) * it.radius,
          ]}
        >
          <Float
            speed={it.floatSpeed}
            rotationIntensity={0.9}
            floatIntensity={1.1}
            floatingRange={[-0.25, 0.25]}
          >
            <group rotation={it.rotation} scale={it.scale}>
              <Item />
            </group>
          </Float>
        </group>
      ))}
    </group>
  );
}

/**
 * Two counter-rotating rings of ingredients drifting gracefully around
 * the jar: red chilies on the outer ring, garlic cloves closer in.
 */
export default function FloatingIngredients() {
  return (
    <group position={[0, -0.2, 0]}>
      <OrbitingRing count={6} radius={2.4} speed={0.11} seed={7} yRange={[-1.1, 1.5]}>
        {Chili}
      </OrbitingRing>
      <OrbitingRing count={5} radius={1.9} speed={-0.08} seed={23} yRange={[-1.3, 1.2]}>
        {Garlic}
      </OrbitingRing>
    </group>
  );
}
