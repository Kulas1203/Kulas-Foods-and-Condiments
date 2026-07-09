import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from '@react-three/drei';
import ChiliJar from './ChiliJar.jsx';
import FloatingIngredients from './FloatingIngredients.jsx';
import SpiceParticles from './SpiceParticles.jsx';

/**
 * Full-viewport 3D hero scene: the Kulas jar front and center, orbited by
 * procedural chilies and garlic cloves, wrapped in drifting spice dust.
 *
 * The environment map is built procedurally from Lightformers (no HDR
 * download needed) so the glass jar still gets warm, believable
 * reflections offline.
 */
export default function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.35, 7.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        {/* key + fill lighting, warm amber ambience */}
        <ambientLight intensity={0.35} color="#ffe8c8" />
        <spotLight
          position={[4, 6, 6]}
          angle={0.45}
          penumbra={0.8}
          intensity={90}
          color="#fff1dc"
          castShadow
        />
        <pointLight position={[-5, 2, -3]} intensity={25} color="#e8a33d" />
        <pointLight position={[0, -3, 2]} intensity={12} color="#c21807" />

        {/* procedural studio environment for glass reflections */}
        <Environment resolution={256} frames={1}>
          <Lightformer
            intensity={3}
            color="#fff3df"
            position={[0, 4, 5]}
            scale={[7, 4, 1]}
          />
          <Lightformer
            intensity={1.6}
            color="#e8a33d"
            position={[-5, 1, 2]}
            rotation-y={Math.PI / 2}
            scale={[4, 5, 1]}
          />
          <Lightformer
            intensity={1.2}
            color="#e23a22"
            position={[5, -1, 1]}
            rotation-y={-Math.PI / 2}
            scale={[4, 5, 1]}
          />
          <Lightformer
            intensity={2.2}
            color="#ffffff"
            position={[0, 6, 0]}
            rotation-x={Math.PI / 2}
            scale={[8, 8, 1]}
          />
        </Environment>

        <ChiliJar />
        <FloatingIngredients />
        <SpiceParticles />

        <ContactShadows
          position={[0, -2.15, 0]}
          opacity={0.55}
          scale={10}
          blur={2.8}
          far={3.2}
          color="#160300"
        />

        {/* drag to spin — locked to the Y axis (fixed polar angle) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.15}
          maxPolarAngle={Math.PI / 2.15}
          rotateSpeed={0.6}
          makeDefault
        />
      </Suspense>
    </Canvas>
  );
}
