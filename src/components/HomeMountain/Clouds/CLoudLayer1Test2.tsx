import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";
import { types } from "@theatre/core";

export default function CloudLayer1() {
  const cloudObjRef = useRef<THREE.Group>(null!);
  const { nodes } = useGLTF("/models/Scene1/CloudHQ.glb");

  const [materialProps, setMaterialProps] = useState({
    color: "#ffffff",
    roughness: 0.5,
    metalness: 0.0,
    transmission: 0.0,
    thickness: 0.0,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    opacity: 1.0,
    ior: 1.5,
    envMapIntensity: 1.0,
  });

  useEffect(() => {
    if (!cloudObjRef.current) return;

    const unsubscribe = cloudObjRef.current.onValuesChange((values) => {
      setMaterialProps({
        color: values.color,
        roughness: values.roughness,
        metalness: values.metalness,
        transmission: values.transmission,
        thickness: values.thickness,
        clearcoat: values.clearcoat,
        clearcoatRoughness: values.clearcoatRoughness,
        opacity: values.opacity,
        ior: values.ior,
        envMapIntensity: values.envMapIntensity,
      });
    });

    return () => unsubscribe();
  }, [cloudObjRef]);

  // Create a shared material instance or props object
  const commonMaterialProps = {
    color: new THREE.Color(materialProps.color),
    roughness: materialProps.roughness,
    metalness: materialProps.metalness,
    transmission: materialProps.transmission,
    thickness: materialProps.thickness,
    clearcoat: materialProps.clearcoat,
    clearcoatRoughness: materialProps.clearcoatRoughness,
    opacity: materialProps.opacity,
    ior: materialProps.ior,
    envMapIntensity: materialProps.envMapIntensity,
    transparent: materialProps.opacity < 1.0,
    depthWrite: materialProps.opacity >= 1.0 // Disable depth write if transparent to avoid sorting issues (optional)
  };

  return (
    <>
      <e.group
        theatreKey="scene1-cloudHQ"
        objRef={cloudObjRef}
        additionalProps={{
          color: types.rgba({ r: 1, g: 1, b: 1, a: 1 }),
          roughness: types.number(0.5, { range: [0, 1] }),
          metalness: types.number(0.0, { range: [0, 1] }),
          transmission: types.number(0.0, { range: [0, 1] }),
          thickness: types.number(0.0, { range: [0, 10] }),
          clearcoat: types.number(0.0, { range: [0, 1] }),
          clearcoatRoughness: types.number(0.0, { range: [0, 1] }),
          opacity: types.number(1.0, { range: [0, 1] }),
          ior: types.number(1.5, { range: [1, 2.33] }),
          envMapIntensity: types.number(1.0, { range: [0, 5] })
        }}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.clouds3006.geometry}
          position={[-28.749, 462.117, -147.888]}
          rotation={[0, -0.047, 0]}
          scale={2.69}
        >
          <meshPhysicalMaterial {...commonMaterialProps} wireframe={false} flatShading={true} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.clouds3001.geometry}
          position={[-25.895, 458.167, -149.6]}
          rotation={[0, -0.295, 0]}
          scale={2.13}
        >
          <meshPhysicalMaterial {...commonMaterialProps} wireframe={false} flatShading={true} />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.clouds3002.geometry}
          position={[-25.895, 457.814, -149.6]}
          rotation={[0, 0.057, 0]}
          scale={1.752}
        >
          <meshPhysicalMaterial {...commonMaterialProps} wireframe={false} flatShading={true} />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.clouds3003.geometry}
          position={[-25.895, 447.139, -149.6]}
          rotation={[0, 0.057, 0]}
          scale={1.369}
        >
          <meshPhysicalMaterial {...commonMaterialProps} wireframe={false} flatShading={true} />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.clouds3005.geometry}
          position={[-68.017, 469.216, -147.888]}
          rotation={[0, 0.057, 0]}
          scale={0.728}
        >
          <meshPhysicalMaterial {...commonMaterialProps} wireframe={false} flatShading={true} />
        </mesh>


        <mesh
          castShadow
          receiveShadow
          geometry={nodes.clouds3008.geometry}
          position={[22.485, 469.216, -147.888]}
          rotation={[0, 0.057, 0]}
          scale={0.728}
        >
          <meshPhysicalMaterial {...commonMaterialProps} wireframe={false} flatShading={true} />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.clouds3009.geometry}
          position={[-28.749, 449.271, -147.888]}
          rotation={[0.054, 0.057, 0]}
          scale={1.035}
        >
          <meshPhysicalMaterial {...commonMaterialProps} wireframe={false} flatShading={true} />
        </mesh>
      </e.group>
    </>
  );
}
