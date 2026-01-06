import { useGLTF } from "@react-three/drei";
import { editable as e, useCurrentSheet } from "@theatre/r3f";
import { useEffect, useState } from "react";
import * as THREE from "three";
import LetterBox from "./LetterBox";
import Lamps from "./Lamps";
import CryogonText from "./CryogonText";
import MountainClouds from "./MountainClouds";
import BonFire from "./BonFire";

const HomeMountain = () => {
  const homeMountainModelUpper = useGLTF("/models/HomeMountainUpper.glb");
  const homeMountainModelBottom = useGLTF("/models/HomeMountainBottom.glb");
  const homeMountainTop = useGLTF("/models/HomeMountainTop.glb");
  const homeMountainFence = useGLTF("/models/Fence-HomeMountainTop.glb");
  const homeMountainStonePath = useGLTF("/models/StonePath-HomeMountainTop.glb");
  const homeMountainTreeHome = useGLTF("/models/Tree_Home.glb");
  const homeMountainBigBolder = useGLTF("/models/BigBoulders_Home.glb");
  const homeMountainTempleHome = useGLTF("/models/Temple_Home.glb");
  const homeMountainAxe = useGLTF("/models/Axe.glb");
  const homeMountainMainHouse = useGLTF("/models/MainHouse_Home-2.glb");
  const homeMountainSittingLogs = useGLTF("/models/sittingLogs_Home.glb");

  const [showClouds, setShowClouds] = useState(false)
  const sheet = useCurrentSheet()

  useEffect(() => {
    const showCloudsObject = sheet?.object('showCloudsToggle', {
      showClouds: showClouds
    }, { reconfigure: true })
    showCloudsObject?.onValuesChange(values => {
      setShowClouds(values.showClouds)
    })
  }, [sheet])

  useEffect(() => {
    const models = [
      homeMountainModelUpper,
      homeMountainModelBottom,
      homeMountainTop,
      homeMountainFence,
      homeMountainStonePath,
      homeMountainTreeHome,
      homeMountainBigBolder,
      homeMountainTempleHome,
      homeMountainAxe,
      homeMountainMainHouse,
      homeMountainSittingLogs,
    ];

    models.forEach((model) => {
      model.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    });
  }, [
    homeMountainModelUpper,
    homeMountainModelBottom,
    homeMountainTop,
    homeMountainFence,
    homeMountainStonePath,
    homeMountainTreeHome,
    homeMountainBigBolder,
    homeMountainTempleHome,
    homeMountainAxe,
    homeMountainMainHouse,
    homeMountainSittingLogs,
  ]);
  return (
    <>
      <e.primitive
        editableType="group"
        theatreKey="HomeMountainModelUpper"
        object={homeMountainModelUpper.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="HomeMountainModelBottom"
        object={homeMountainModelBottom.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="HomeMountainTop"
        object={homeMountainTop.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="HomeMountainFence"
        object={homeMountainFence.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="HomeMountainStonePath"
        object={homeMountainStonePath.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="HomeMountainTreeHome"
        object={homeMountainTreeHome.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="homeMountainBigBolder"
        object={homeMountainBigBolder.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="homeMountainTempleHome"
        object={homeMountainTempleHome.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="homeMountainAxe"
        object={homeMountainAxe.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="homeMountainMainHouse"
        object={homeMountainMainHouse.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="homeMountainTempleHome"
        object={homeMountainTempleHome.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="homeMountainSittingLogs1"
        object={homeMountainSittingLogs.scene.clone()}
      />
      <e.primitive
        editableType="group"
        theatreKey="homeMountainSittingLogs2"
        object={homeMountainSittingLogs.scene.clone()}
      />
      <e.primitive
        editableType="group"
        theatreKey="homeMountainSittingLogs3"
        object={homeMountainSittingLogs.scene.clone()}
      />
      <e.primitive
        editableType="group"
        theatreKey="homeMountainSittingLogs4"
        object={homeMountainSittingLogs.scene.clone()}
      />
      <LetterBox />
      <Lamps />
      <CryogonText />
      <BonFire />
      {showClouds &&
        <MountainClouds />
      }
    </>
  );
};

export default HomeMountain;
