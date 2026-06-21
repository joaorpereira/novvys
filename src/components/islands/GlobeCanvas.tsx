import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface SceneProps {
  mouseX: number;
  mouseY: number;
}

function StarField() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 8 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial
        size={0.015}
        color="#93c5fd"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function ParticleGlobe({ mouseX, mouseY }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(2.2, 5), []);
  const ringGeometry = useMemo(() => new THREE.TorusGeometry(2.8, 0.008, 8, 128), []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15 + mouseX * 0.002;
      pointsRef.current.rotation.x += delta * 0.05 + mouseY * 0.002;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + mouseY * 0.1;
      ringRef.current.rotation.z += delta * 0.08;
    }
  });

  return (
    <group>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={0.03}
          color="#3b82f6"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <mesh ref={ringRef} geometry={ringGeometry}>
        <meshBasicMaterial
          color="#2563eb"
          transparent
          opacity={0.25}
          wireframe
        />
      </mesh>
    </group>
  );
}

function Scene({ mouseX, mouseY }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={1.8} color="#2563eb" />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#1d4ed8" />
      <StarField />
      <ParticleGlobe mouseX={mouseX} mouseY={mouseY} />
      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function GlobeCanvas() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  return (
    <div
      className="globe-wrapper"
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <div className="globe-fallback" />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Scene mouseX={mouse.x} mouseY={mouse.y} />
      </Canvas>
      <div className="globe-glow" />
      <div className="globe-glow globe-glow--secondary" />
      <style>{`
        .globe-wrapper {
          position: relative;
          width: 100%;
          max-width: 620px;
          aspect-ratio: 1;
          margin-inline: auto;
        }
        .globe-fallback {
          position: absolute;
          inset: 5%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, rgba(37, 99, 235, 0.1) 40%, transparent 70%);
          z-index: 0;
        }
        .globe-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow:
            0 0 80px 30px rgba(37, 99, 235, 0.2),
            0 0 160px 60px rgba(37, 99, 235, 0.08);
          pointer-events: none;
          z-index: 2;
        }
        .globe-glow--secondary {
          inset: -15%;
          box-shadow: 0 0 200px 80px rgba(29, 78, 216, 0.06);
          z-index: 0;
        }
        .globe-wrapper canvas {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
