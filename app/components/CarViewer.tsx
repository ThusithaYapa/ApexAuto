"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface CarModelProps {
  color: string;
  modelPath: string;
}

function CarModel({ color, modelPath }: CarModelProps) {
  const { scene } = useGLTF(modelPath);

  scene.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;

      // Keep glass black / transparent
      if (
        mesh.name.toLowerCase().includes("glass") ||
        mesh.name.toLowerCase().includes("window")
      ) {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: 0x000000,
          metalness: 0.1,
          roughness: 0,
          transparent: true,
          opacity: 0.5,
          transmission: 0.9,
        });
        return;
      }

      // Car body color
      mesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.8,
        roughness: 0.2,
      });
    }
  });

  return <primitive object={scene} />;
}

interface CarViewerProps {
  color: string;
  modelPath: string;
}

export default function CarViewer({ color, modelPath }: CarViewerProps) {
  return (
    <Canvas camera={{ position: [6, 3.5, 10] }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Environment preset="city" />
      <CarModel color={color} modelPath={modelPath} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
