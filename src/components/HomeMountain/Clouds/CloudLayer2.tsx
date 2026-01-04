import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Clouds, Cloud, useGLTF } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";
import { types } from "@theatre/core";

export default function CloudLayer2() {
  const cloudObjRef = useRef<THREE.Group>(null!);
  const [cloudProps, setCloudProps] = useState({
    scale: 5,
    volume: 20,
    color: "#ff69b4", // use hex or string for drei cloud color
    fade: 100,
    growth: 0,
    speed: 0,
    opacity: 1,
    concentrate: "random",
  });

  useEffect(() => {
    if (!cloudObjRef.current || "onValuesChange" in cloudObjRef.current) return;

    const unsubscribe = (cloudObjRef.current as any).onValuesChange((values: any) => {
      // When values change in the studio, update the React state
      setCloudProps({
        scale: values.cloudScale,
        volume: values.cloudVolume,
        // Convert rgba from Theatre to a format Drei's <Cloud> component expects (hex/css string)
        color: `rgba(${Math.round(values.cloudColor.r * 255)}, 
                      ${Math.round(values.cloudColor.g * 255)}, 
                      ${Math.round(values.cloudColor.b * 255)}, 
                      ${values.cloudColor.a})`,
        fade: values.cloudFade,
        growth: values.cloudGrowth,
        speed: values.cloudSpeed,
        opacity: values.cloudOpacity,
        concentrate: "random",
      });
    });

    return () => {
      unsubscribe();
    };
  }, [cloudObjRef]);

  const cloudsPath = useGLTF("/models/Scene1/Clouds2.glb");
  const vertices = useMemo(() => {
    const st = new Set<{ x: number; y: number; z: number; seed: number }>();
    Object.keys(cloudsPath.nodes).forEach((key) => {
      if ("geometry" in cloudsPath.nodes[key]) {
        const geometry = cloudsPath.nodes[key].geometry as THREE.BufferGeometry;
        if (geometry) {
          const positions = geometry.attributes.position.array;
          for (let i = 0; i < positions.length / 3; i++) {
            const i3 = i * 3;
            st.add({
              x: positions[i3],
              y: positions[i3 + 1],
              z: positions[i3 + 2],
              seed: Math.round(positions[i3 + 1] * positions[i3] * 100),
            });
          }
        }

      }
    });
    return [...st];
  }, [cloudsPath]);

  return (
    <>
      <e.group
        theatreKey="scene1-clouds2"
        objRef={cloudObjRef}
        additionalProps={{
          cloudScale: types.number(1, {
            range: [0.1, 10],
            nudgeMultiplier: 0.1,
          }),
          cloudVolume: types.number(2, {
            range: [0.1, 20],
            nudgeMultiplier: 0.1,
          }),
          cloudColor: types.rgba({ r: 1, g: 0.41, b: 0.71, a: 1 }),
          cloudFade: types.number(100, { range: [0, 200], nudgeMultiplier: 1 }),
          cloudGrowth: types.number(0, {
            range: [-10, 10],
            nudgeMultiplier: 0.01,
          }),
          cloudSpeed: types.number(0, {
            range: [-10, 10],
            nudgeMultiplier: 0.01,
          }),
          cloudOpacity: types.number(1, {
            range: [0, 1],
            nudgeMultiplier: 0.01,
          }),
        }}
      >
        {vertices.map((each, index) => {
          return (
            <Clouds material={THREE.MeshPhysicalMaterial}>
              <Cloud
                seed={each.seed}
                key={index}
                position={[each.x, each.y, each.z]}
                scale={cloudProps.scale}
                volume={cloudProps.volume}
                color={cloudProps.color}
                fade={cloudProps.fade}
                growth={cloudProps.growth}
                speed={cloudProps.speed}
                opacity={cloudProps.opacity}
              />
            </Clouds>
          );
        })}
      </e.group>
    </>
  );
}
