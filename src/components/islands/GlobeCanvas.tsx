import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const GLOBE_RADIUS = 2.15;

interface SceneProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

function buildLatLongGeometry(radius: number) {
  const segments: number[] = [];
  const ringSteps = 36;
  const meridianSteps = 48;

  for (let lat = -75; lat <= 75; lat += 15) {
    const phi = ((90 - lat) * Math.PI) / 180;
    for (let i = 0; i < ringSteps; i++) {
      const t1 = (i / ringSteps) * Math.PI * 2;
      const t2 = ((i + 1) / ringSteps) * Math.PI * 2;
      const push = (theta: number) => {
        segments.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      };
      push(t1);
      push(t2);
    }
  }

  for (let lon = 0; lon < 360; lon += 20) {
    const theta = (lon * Math.PI) / 180;
    for (let i = 0; i < meridianSteps; i++) {
      const phi1 = (i / meridianSteps) * Math.PI;
      const phi2 = ((i + 1) / meridianSteps) * Math.PI;
      const push = (phi: number) => {
        segments.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      };
      push(phi1);
      push(phi2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
  return geo;
}

function LatLongGrid() {
  const geometry = useMemo(() => buildLatLongGeometry(GLOBE_RADIUS * 1.002), []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#3b82f6" transparent opacity={0.35} />
    </lineSegments>
  );
}

function WireframeShell() {
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(GLOBE_RADIUS, 3),
    []
  );

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color="#2563eb"
        wireframe
        transparent
        opacity={0.22}
      />
    </mesh>
  );
}

function CoreGlow() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 0.88, 64, 64]} />
      <meshBasicMaterial
        color="#1d4ed8"
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </mesh>
  );
}

function AtmosphereRim() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 1.04, 64, 64]} />
      <meshBasicMaterial
        color="#60a5fa"
        transparent
        opacity={0.06}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function ParticleShell({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(GLOBE_RADIUS, 4), []);
  const targetRot = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!ref.current) return;
    targetRot.current.y = mouse.current.x * 0.4;
    targetRot.current.x = mouse.current.y * 0.25;
    ref.current.rotation.y += delta * 0.1;
    ref.current.rotation.y += (targetRot.current.y - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (targetRot.current.x - ref.current.rotation.x) * 0.05;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.055}
        color="#93c5fd"
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function NetworkArcs() {
  const ref = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(GLOBE_RADIUS, 2);
    const verts = ico.attributes.position.array as Float32Array;
    const vertCount = verts.length / 3;
    const segments: number[] = [];
    const used = new Set<string>();

    const addArc = (i: number, j: number) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (used.has(key)) return;
      used.add(key);

      const ax = verts[i * 3];
      const ay = verts[i * 3 + 1];
      const az = verts[i * 3 + 2];
      const bx = verts[j * 3];
      const by = verts[j * 3 + 1];
      const bz = verts[j * 3 + 2];

      const mid = new THREE.Vector3((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2)
        .normalize()
        .multiplyScalar(GLOBE_RADIUS * 1.22);

      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(ax, ay, az),
        mid,
        new THREE.Vector3(bx, by, bz)
      );

      const points = curve.getPoints(16);
      for (let k = 0; k < points.length - 1; k++) {
        segments.push(points[k].x, points[k].y, points[k].z);
        segments.push(points[k + 1].x, points[k + 1].y, points[k + 1].z);
      }
    };

    for (let n = 0; n < 22; n++) {
      const i = Math.floor(Math.random() * vertCount);
      let j = Math.floor(Math.random() * vertCount);
      if (j === i) j = (j + 1) % vertCount;
      addArc(i, j);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#60a5fa" transparent opacity={0.45} toneMapped={false} />
    </lineSegments>
  );
}

function OrbitRing({
  radius,
  tilt,
  speed,
  opacity = 0.3,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.012, 8, 128]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

function StarField() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#bfdbfe"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function GlobeScene({ mouse }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    targetRot.current.y = mouse.current.x * 0.15;
    targetRot.current.x = mouse.current.y * 0.08;
    groupRef.current.rotation.y += delta * 0.04;
    groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[6, 4, 6]} intensity={3} color="#3b82f6" />
      <pointLight position={[-5, -3, -4]} intensity={1.2} color="#2563eb" />
      <group ref={groupRef}>
        <StarField />
        <CoreGlow />
        <AtmosphereRim />
        <WireframeShell />
        <LatLongGrid />
        <NetworkArcs />
        <ParticleShell mouse={mouse} />
        <OrbitRing radius={2.7} tilt={[Math.PI / 2.2, 0.25, 0]} speed={0.07} opacity={0.5} />
        <OrbitRing radius={3.0} tilt={[Math.PI / 2.6, -0.45, 0.35]} speed={-0.05} opacity={0.28} />
        <OrbitRing radius={3.3} tilt={[Math.PI / 3, 0.7, -0.15]} speed={0.035} opacity={0.15} />
      </group>
      <EffectComposer>
        <Bloom
          intensity={2.4}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function GlobeCanvas() {
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  return (
    <div
      className="globe-canvas"
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <style>{`
        .globe-canvas {
          width: 100%;
          height: 100%;
          min-height: inherit;
        }
        .globe-canvas canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <GlobeScene mouse={mouse} />
      </Canvas>
    </div>
  );
}
