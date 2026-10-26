import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import React, { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url, true);
  return <primitive object={gltf.scene} />;
}

function Fallback({ colorHex }: { colorHex: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += dt * 0.2;
  });
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0b0b0f"),
        metalness: 1,
        roughness: 0.22,
        envMapIntensity: 1
      }),
    []
  );
  const glow = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        metalness: 0.8,
        roughness: 0.35,
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: 0.35
      }),
    [colorHex]
  );
  return (
    <group>
      <mesh ref={mesh} position={[0, 0, 0]} castShadow material={mat}>
        <icosahedronGeometry args={[1.1, 1]} />
      </mesh>
      <mesh position={[0, -0.25, 0]} castShadow material={glow}>
        <torusGeometry args={[1.15, 0.055, 18, 120]} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[5, 7, 3]} intensity={1.25} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-4, 2, 2]} intensity={0.75} color="#d4af37" />
      <spotLight position={[0, 6, -5]} intensity={0.65} angle={0.35} penumbra={0.6} />
    </>
  );
}

export default function ProductViewer({
  modelUrl,
  color = "Black",
  onError
}: {
  modelUrl?: string;
  color?: string;
  onError?: () => void;
}) {
  const colorHex = color.toLowerCase().includes("gold") ? "#d4af37" : "#ffffff";
  const [failed, setFailed] = useState(false);

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.25, 4.2], fov: 42 }}>
      <color attach="background" args={["#060608"]} />
      <fog attach="fog" args={["#060608", 7, 16]} />
      <Lights />

      <Suspense fallback={<Fallback colorHex={colorHex} />}>
        {modelUrl && !failed ? (
          <ErrorBoundary
            onError={() => {
              setFailed(true);
              onError?.();
            }}
          >
            <Model url={modelUrl} />
          </ErrorBoundary>
        ) : (
          <Fallback colorHex={colorHex} />
        )}
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      <OrbitControls enablePan={false} minDistance={2.6} maxDistance={6.4} />
    </Canvas>
  );
}

class ErrorBoundary extends React.Component<{ onError?: () => void; children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// Let drei cache GLTFs when they exist.
useGLTF.preload("/models/tshirt.glb");
