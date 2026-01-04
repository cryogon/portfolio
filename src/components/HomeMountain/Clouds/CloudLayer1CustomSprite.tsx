import { editable as e, useCurrentSheet } from "@theatre/r3f";
import { types } from "@theatre/core";
import { useState, useRef, useEffect, useMemo } from "react";
import { useTexture, useGLTF, Billboard } from "@react-three/drei";
import * as THREE from 'three'

function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    // Returns a float between 0 (inclusive) and 1 (exclusive)
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

const seed = 12345;
const seededRandom = mulberry32(seed);

export default function CloudLayer1() {
  const [density1, setDensity1] = useState(0.9);
  const [density2, setDensity2] = useState(0.9);
  const [density3, setDensity3] = useState(0.9);
  const [density4, setDensity4] = useState(0.9);

  const [size1, setSize1] = useState(40);
  const [size2, setSize2] = useState(40);
  const [size3, setSize3] = useState(40);
  const [size4, setSize4] = useState(40);

  const sheet = useCurrentSheet();

  useEffect(() => {
    const densityObject1 = sheet?.object("scene1-cloud1-sprite / density", {
      density: types.number(0.9, { range: [0, 1] }),
      size: types.number(40, { range: [1, 100] })
    }, { reconfigure: true });
    const unsub1 = densityObject1?.onValuesChange(value => {
      setDensity1(value.density);
      setSize1(value.size);
    });

    const densityObject2 = sheet?.object("scene1-cloud2-sprite / density", {
      density: types.number(0.9, { range: [0, 1] }),
      size: types.number(40, { range: [1, 100] })
    }, { reconfigure: true });
    const unsub2 = densityObject2?.onValuesChange(value => {
      setDensity2(value.density);
      setSize2(value.size);
    });

    const densityObject3 = sheet?.object("scene1-cloud3-sprite / density", {
      density: types.number(0.9, { range: [0, 1] }),
      size: types.number(40, { range: [1, 100] })
    }, { reconfigure: true });
    const unsub3 = densityObject3?.onValuesChange(value => {
      setDensity3(value.density);
      setSize3(value.size);
    });

    const densityObject4 = sheet?.object("scene1-cloud4-sprite / density", {
      density: types.number(0.9, { range: [0, 1] }),
      size: types.number(40, { range: [1, 100] })
    }, { reconfigure: true });
    const unsub4 = densityObject4?.onValuesChange(value => {
      setDensity4(value.density);
      setSize4(value.size);
    });
  }, [sheet]);

  const cloud1Ref = useRef<THREE.Group>(null!);
  const cloud2Ref = useRef<THREE.Group>(null!);
  const cloud3Ref = useRef<THREE.Group>(null!);
  const cloud4Ref = useRef<THREE.Group>(null!);

  const tex = useTexture('/public/texture/Clouds.png');

  const cloudsPath1 = useGLTF("/models/Scene1/Clouds1.glb");
  const cloudsPath2 = useGLTF("/models/Scene1/Clouds2.glb");
  const cloudsPath3 = useGLTF("/models/Scene1/Clouds3.glb");
  const cloudsPath4 = useGLTF("/models/Scene1/Clouds4.glb");

  const processVertices = (gltf: any, density: number) => {
    const st = new Set<{ x: number; y: number; z: number }>();
    Object.keys(gltf.nodes).forEach((key) => {
      const geometry = gltf.nodes[key].geometry;
      if (geometry) {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length / 3; i++) {
          if (seededRandom() < 1.0 - density) continue
          const i3 = i * 3;
          const randomOffset = 10;
          st.add({
            x: positions[i3] + seededRandom() * randomOffset,
            y: positions[i3 + 1] + seededRandom() * randomOffset,
            z: positions[i3 + 2] + seededRandom() * randomOffset,
          });
        }
      }
    });
    return [...st];
  };

  const vertices1 = useMemo(() => processVertices(cloudsPath1, density1), [cloudsPath1, density1]);
  const vertices2 = useMemo(() => processVertices(cloudsPath2, density2), [cloudsPath2, density2]);
  const vertices3 = useMemo(() => processVertices(cloudsPath3, density3), [cloudsPath3, density3]);
  const vertices4 = useMemo(() => processVertices(cloudsPath4, density4), [cloudsPath4, density4]);

  const renderCloudGroup = (vertices: { x: number, y: number, z: number }[], theatreKey: string, ref: React.MutableRefObject<THREE.Group>, size: number) => (
    <e.group theatreKey={theatreKey} objRef={ref}>
      {vertices.map((each, index) => (
        <Billboard lockY={true} lockX={true} lockZ={true}>
          <mesh
            key={index}
            position={[each.x, each.y, each.z]}
            scale={[size, size, size]}
          >
            <planeGeometry />
            <meshBasicMaterial
              side={THREE.DoubleSide}
              map={tex}
              transparent={true}
              alphaTest={0.9}
            />
          </mesh>
        </Billboard>
      ))}
    </e.group>
  );

  return (
    <>
      {renderCloudGroup(vertices1, "scene1-cloud1-sprite", cloud1Ref, size1)}
      {renderCloudGroup(vertices2, "scene1-cloud2-sprite", cloud2Ref, size2)}
      {renderCloudGroup(vertices3, "scene1-cloud3-sprite", cloud3Ref, size3)}
      {renderCloudGroup(vertices4, "scene1-cloud4-sprite", cloud4Ref, size4)}
    </>
  );
}

