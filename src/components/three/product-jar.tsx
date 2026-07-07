"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Float,
  ContactShadows,
  PresentationControls,
  Html,
  useProgress,
} from "@react-three/drei";
import type { Group } from "three";

/**
 * A procedurally-built glass jar of Kulas Chili Garlic Sauce.
 * Kept lightweight (primitives + physical materials) so it renders
 * beautifully without external GLTF assets. Swap in a real .glb via
 * useGLTF later without touching the surrounding scene.
 */
function Jar() {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={group} position={[0, -0.2, 0]} scale={1.15}>
      {/* Glass body */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.85, 0.8, 1.7, 64]} />
        <meshPhysicalMaterial
          color="#3a0a06"
          roughness={0.08}
          transmission={0.55}
          thickness={1.2}
          ior={1.45}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      {/* Sauce fill */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.78, 0.74, 1.35, 64]} />
        <meshStandardMaterial
          color="#7a1006"
          roughness={0.35}
          emissive="#c1121f"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.62, 0.7, 0.35, 64]} />
        <meshPhysicalMaterial color="#3a0a06" roughness={0.1} transmission={0.4} />
      </mesh>
      {/* Metal lid */}
      <mesh castShadow position={[0, 1.28, 0]}>
        <cylinderGeometry args={[0.68, 0.66, 0.34, 64]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.35} />
      </mesh>
      {/* Lid rim highlight */}
      <mesh position={[0, 1.45, 0]}>
        <torusGeometry args={[0.66, 0.03, 16, 64]} />
        <meshStandardMaterial color="#F4B400" metalness={1} roughness={0.2} />
      </mesh>
      {/* Chili on top */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.4}>
        <mesh position={[0, 1.7, 0]} rotation={[0, 0, Math.PI / 2.4]}>
          <capsuleGeometry args={[0.09, 0.6, 8, 16]} />
          <meshStandardMaterial color="#e01e12" roughness={0.3} />
        </mesh>
      </Float>
      {/* Label ring */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.855, 0.805, 0.95, 64, 1, true]} />
        <meshStandardMaterial color="#0d0d0f" roughness={0.7} side={2} />
      </mesh>
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="font-button text-xs tracking-widest text-brand-secondary">
        {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export function ProductJarScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <ambientLight intensity={0.4} />
      <spotLight
        position={[4, 6, 4]}
        angle={0.3}
        penumbra={1}
        intensity={2.5}
        color="#ff8a5c"
        castShadow
      />
      <spotLight position={[-4, 2, -2]} intensity={1.2} color="#f4b400" />
      <Suspense fallback={<Loader />}>
        <PresentationControls
          global
          polar={[-0.2, 0.3]}
          azimuth={[-0.6, 0.6]}
          snap
        >
          <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.8}>
            <Jar />
          </Float>
        </PresentationControls>
        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.55}
          scale={8}
          blur={2.6}
          far={4}
          color="#000000"
        />
        {/* Procedural studio environment — no network fetch, so it can't
            fail offline or in sandboxed runtimes. Warm rim + soft key light
            give the glass its reflections. */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={3}
            color="#ff8a5c"
            position={[3, 4, 3]}
            scale={[6, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2}
            color="#f4b400"
            position={[-4, 2, -2]}
            scale={[5, 5, 1]}
          />
          <Lightformer
            form="ring"
            intensity={1.5}
            color="#ffffff"
            position={[0, -3, 2]}
            scale={[3, 3, 1]}
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
