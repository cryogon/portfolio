import { Cloud, Clouds } from "@react-three/drei";
import CloudLayer1 from "./Clouds/CloudLayer1CustomSprite.tsx";
import CloudLayer2 from "./Clouds/CloudLayer2";
import { editable as e } from "@theatre/r3f";
import { useRef, useState, useEffect } from "react";
import { types } from "@theatre/core";
import * as THREE from "three";

export default function MountainClouds() {
  const cloudObjRef = useRef<THREE.Group>(null!);

  const [cloudProps, setCloudProps] = useState({
    seed: 1,
    scale: 5,
    volume: 20,
    color: "#ff69b4", // use hex or string for drei cloud color
    fade: 100,
    growth: 0,
    speed: 0,
    opacity: 1,
  });

  useEffect(() => {
    if (!cloudObjRef.current && !("onValuesChange" in cloudObjRef.current)) return;

    const unsubscribe = (cloudObjRef.current as any).onValuesChange((values: any) => {
      // When values change in the studio, update the React state
      setCloudProps({
        seed: values.cloudSeed,
        scale: values.cloudScale,
        volume: values.cloudVolume,
        // Convert rgba from Theatre to a format Drei's <Cloud> component expects (hex/css string)
        color: `rgba(${Math.round(values.cloudColor.r * 255)}, ${Math.round(
          values.cloudColor.g * 255,
        )}, ${Math.round(values.cloudColor.b * 255)}, ${values.cloudColor.a
          })`,
        fade: values.cloudFade,
        growth: values.cloudGrowth,
        speed: values.cloudSpeed,
        opacity: values.cloudOpacity,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [cloudObjRef]);
  return (
    <group>
      <CloudLayer1 />
      <CloudLayer2 />
      {/* <CloudLayer3 /> */}
      <e.group
        theatreKey="transparency-cloud"
        objRef={cloudObjRef}
        additionalProps={{
          cloudSeed: types.number(1, { range: [0, 100], nudgeMultiplier: 1 }),
          cloudScale: types.number(1, {
            range: [0.1, 100],
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
        <Clouds material={THREE.MeshPhysicalMaterial}>
          <Cloud {...cloudProps} segments={40} />
        </Clouds>
      </e.group>
    </group>
  );
}
