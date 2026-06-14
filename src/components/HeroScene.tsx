"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * The abstract hero object: a slowly rotating, gently distorted icosahedron
 * with a wireframe shell — premium, not a cliché globe. Mouse moves tilt it.
 * Low poly, DPR-capped, and paused when off-screen.
 */
function Knot({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    // continuous slow base rotation
    g.rotation.y += delta * 0.18;
    g.rotation.x += delta * 0.04;
    // mouse-parallax: eased tilt on z + gentle positional drift
    const targetZ = pointer.current.x * 0.18;
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, targetZ, 0.05);
    g.position.x = THREE.MathUtils.lerp(g.position.x, pointer.current.x * 0.3, 0.05);
    g.position.y = THREE.MathUtils.lerp(g.position.y, -pointer.current.y * 0.2, 0.05);
    invalidate();
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.6}>
        {/* solid distorted core — kept low-poly (detail 4) for performance */}
        <Icosahedron args={[1.55, 4]}>
          <MeshDistortMaterial
            color="#E3B341"
            emissive="#7a5a12"
            emissiveIntensity={0.25}
            roughness={0.28}
            metalness={0.65}
            distort={0.32}
            speed={1.4}
          />
        </Icosahedron>
        {/* hairline wireframe shell */}
        <Icosahedron args={[1.78, 1]}>
          <meshBasicMaterial color="#EDE6D6" wireframe transparent opacity={0.12} />
        </Icosahedron>
      </Float>
    </group>
  );
}

function Rig({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={1.6} color="#fff4d8" />
      <pointLight position={[-6, -3, 2]} intensity={1.1} color="#5FB3A1" />
      <Knot pointer={pointer} />
    </>
  );
}

export default function HeroScene() {
  const pointer = useRef({ x: 0, y: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    // pause the scene when scrolled off-screen
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 1.6]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Rig pointer={pointer} />
      </Canvas>
    </div>
  );
}
