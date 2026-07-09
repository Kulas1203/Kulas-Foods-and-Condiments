import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const LABEL_ARC = 2.1; // radians of the jar the label wraps around

/**
 * The hero product, built entirely from primitives:
 *  - glass cylinder body (physical material with transmission)
 *  - dark red "sauce" cylinder inside
 *  - glossy black cylinder lid with a rounded torus edge
 *  - the real product-label photo wrapped onto an open cylinder segment
 *    hugging the front face of the glass
 *
 * Interactions: tilts and bobs when hovered, spins slowly as the page
 * scrolls (OrbitControls in Scene.jsx adds Y-locked dragging on top).
 */
export default function ChiliJar() {
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  const scrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

  const label = useTexture('/textures/label.jpg', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  });

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'grab' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // gentle idle bob, livelier when hovered
    const bob = hovered
      ? Math.sin(t * 2.6) * 0.09
      : Math.sin(t * 1.1) * 0.045;
    g.position.y = THREE.MathUtils.lerp(g.position.y, -0.55 + bob, 0.08);

    // hover tilt
    const tiltX = hovered ? Math.sin(t * 1.9) * 0.05 + 0.1 : 0;
    const tiltZ = hovered ? Math.cos(t * 1.6) * 0.05 - 0.09 : 0;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tiltX, 0.06);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, tiltZ, 0.06);

    // slow scroll-driven spin + a whisper of idle sway
    const targetY = scrollY.current * 0.0032 + Math.sin(t * 0.25) * 0.06;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.055);
  });

  return (
    <group
      ref={group}
      position={[0, -0.55, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* glass body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.92, 0.92, 2.3, 64]} />
        <meshPhysicalMaterial
          color="#fff8ec"
          transmission={1}
          thickness={0.45}
          roughness={0.06}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={1.3}
          transparent
        />
      </mesh>

      {/* sauce inside */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.84, 0.84, 2.02, 48]} />
        <meshStandardMaterial
          color="#8e1004"
          roughness={0.45}
          emissive="#3d0a02"
          emissiveIntensity={0.55}
        />
      </mesh>

      {/* glass shoulder tapering into the neck */}
      <mesh position={[0, 1.26, 0]}>
        <cylinderGeometry args={[0.8, 0.92, 0.22, 64]} />
        <meshPhysicalMaterial
          color="#fff8ec"
          transmission={1}
          thickness={0.4}
          roughness={0.08}
          ior={1.5}
          clearcoat={1}
          transparent
        />
      </mesh>

      {/* black lid */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.96, 0.96, 0.42, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.32}
          metalness={0.25}
        />
      </mesh>
      {/* rounded lid edge */}
      <mesh position={[0, 1.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.06, 16, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.28}
          metalness={0.3}
        />
      </mesh>

      {/* product label wrapped on the front face of the jar */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry
          args={[0.945, 0.945, 1.28, 64, 1, true, -LABEL_ARC / 2, LABEL_ARC]}
        />
        <meshStandardMaterial
          map={label}
          roughness={0.85}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}
