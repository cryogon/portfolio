import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from 'three'
import { editable as e } from "@theatre/r3f";
import { useVideoTexture } from "@react-three/drei";

const BonFire = () => {
  const homeMountainBonFireStones = useGLTF("/models/BonFireStones.glb");
  const videoTexture = useVideoTexture('/videos/fire.webm')
  useEffect(() => {
    const models = [
      homeMountainBonFireStones,
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
    homeMountainBonFireStones,
  ]);

  const { fireGeometry, fireMaterial } = useMemo(() => {
    const fireGeometry = new THREE.PlaneGeometry()
    const fireMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      transparent: true
    })
    return { fireGeometry, fireMaterial }
  }, [videoTexture])

  return (
    <>
      <e.primitive
        editableType="group"
        theatreKey="homeMountainBonFireStones"
        object={homeMountainBonFireStones.scene}
      />
      <e.mesh theatreKey="homeMountainBonFire" geometry={fireGeometry} material={fireMaterial} />
    </>
  )
}

export default BonFire
