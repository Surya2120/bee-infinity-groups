import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Rig({ scrollProgress }: { scrollProgress: number }) {
  const { camera, pointer } = useThree();
  useFrame(() => {
    const t = scrollProgress;
    const targetZ = THREE.MathUtils.lerp(8.2, 5.6, t);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.45, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.35 + pointer.y * 0.25, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.07);
    camera.lookAt(0, 1.05, 0);
  });
  return null;
}

function FallbackProduct() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += dt * 0.35;
  });
  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0b0b0f"),
      metalness: 0.9,
      roughness: 0.25
    });
    return m;
  }, []);

  return (
    <Float floatIntensity={1.35} rotationIntensity={0.9} speed={1.1}>
      <mesh ref={mesh} position={[0, 1.05, 0]} castShadow material={mat}>
        <torusKnotGeometry args={[0.62, 0.18, 220, 24]} />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.8, 1.22, 96]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.25} emissive="#d4af37" emissiveIntensity={0.2} />
      </mesh>
    </Float>
  );
}

export default function HeroScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.35, 8.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#060608"]} />
      <fog attach="fog" args={["#060608", 9, 18]} />

      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4.5, 6.5, 2.5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-3, 2.5, 2]} intensity={0.8} color="#d4af37" />
      <spotLight position={[0, 6.5, -4]} intensity={0.75} angle={0.35} penumbra={0.5} color="#ffffff" />

      <Rig scrollProgress={scrollProgress} />
      <FallbackProduct />

      <ContactShadows position={[0, 0, 0]} opacity={0.65} scale={14} blur={2.4} far={10} />
    </Canvas>
  );
}

