import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import type { ThreeElements } from "@react-three/fiber";
import {  useMemo } from "react";

type GLTFResult = GLTF & {
  nodes: {
    clouds3001: THREE.Mesh;
    clouds3002: THREE.Mesh;
    clouds3003: THREE.Mesh;
    clouds3005: THREE.Mesh;
    clouds3006: THREE.Mesh;
    clouds3008: THREE.Mesh;
  };
  materials: {
    [name: string]: THREE.Material;
  };
};

export default function MountainClouds(props: ThreeElements["group"]) {
  const { nodes } = useGLTF(
    "/models/HomeCloudsMain.glb",
  ) as unknown as GLTFResult;


  const cloudsMaterial = useMemo(() => {
    // Initialize the material with initial values
    return new THREE.MeshPhysicalMaterial({
      transparent: true,
      transmission: 0.7,
      roughness: 1.0,
      thickness: 3.0,
      ior: 1.02,
      opacity: 1.0,
    });
  }, []);

  return (
    <group {...props} dispose={null}>
      {/* Assign the same shared material instance to all meshes */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.clouds3001.geometry}
        material={cloudsMaterial} // Use the created material
        position={[-25.895, 458.167, -149.6]}
        rotation={[0, -0.295, 0]}
        scale={2.13}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.clouds3002.geometry}
        material={cloudsMaterial} // Use the created material
        position={[-25.895, 457.814, -149.6]}
        rotation={[0, 0.057, 0]}
        scale={1.752}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.clouds3003.geometry}
        material={cloudsMaterial} // Use the created material
        position={[-25.895, 447.139, -149.6]}
        rotation={[0, 0.057, 0]}
        scale={1.369}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.clouds3005.geometry}
        material={cloudsMaterial} // Use the created material
        position={[-68.017, 469.216, -147.888]}
        rotation={[0, 0.057, 0]}
        scale={0.728}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.clouds3006.geometry}
        material={cloudsMaterial} // Use the created material
        position={[-28.749, 462.117, -147.888]}
        rotation={[0, -0.047, 0]}
        scale={2.69}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.clouds3008.geometry}
        material={cloudsMaterial} // Use the created material
        position={[22.485, 469.216, -147.888]}
        rotation={[0, 0.057, 0]}
        scale={0.728}
      />
    </group>
  );
}

useGLTF.preload("/models/HomeCloudsMain.glb");
