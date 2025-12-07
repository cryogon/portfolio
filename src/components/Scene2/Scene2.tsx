import { useGLTF } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";
import { useEffect } from "react";
import * as THREE from 'three'


const Scene2 = () => {
  const projectMountainBaseOfProjectMountain = useGLTF("/models/Scene2/Base-ProjectMountain.glb");
  const projectMountainBaseOfLevitatingPlatform = useGLTF("/models/Scene2/Base_LevitatingPlatform.glb");
  const projectMountainFloatingDebris = useGLTF("/models/Scene2/FloatingDebris.glb");
  const projectMountainPlatform1 = useGLTF("/models/Scene2/Platform1.glb");
  const projectMountainPlatform1Mountain = useGLTF("/models/Scene2/Project1-Mountain.glb");
  const projectMountainPlatform2Mountain = useGLTF("/models/Scene2/Project2-Mountain.glb");
  const projectMountainPlatform3Mountain = useGLTF("/models/Scene2/Project3-Mountain.glb");
  const projectMountainPlatform4Mountain = useGLTF("/models/Scene2/Project4-Mountain.glb");
  const projectMountainRock = useGLTF("/models/Scene2/Rock.glb");
  const projectMountainTopHalftMountain = useGLTF("/models/Scene2/TopHalf-Mountain.glb");
  const projectMountainVueLogo = useGLTF("/models/Scene2/VueLogo.glb");
  const projectMountainClouds = useGLTF("/models/Scene2/PlatformClouds-2.glb");

  useEffect(() => {
    const models = [
      projectMountainBaseOfProjectMountain,
      projectMountainBaseOfLevitatingPlatform,
      projectMountainFloatingDebris,
      projectMountainPlatform1,
      projectMountainPlatform1Mountain,
      projectMountainPlatform2Mountain,
      projectMountainPlatform3Mountain,
      projectMountainPlatform4Mountain,
      projectMountainRock,
      projectMountainTopHalftMountain,
      projectMountainVueLogo,
      projectMountainClouds
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
      projectMountainBaseOfProjectMountain,
      projectMountainBaseOfLevitatingPlatform,
      projectMountainFloatingDebris,
      projectMountainPlatform1,
      projectMountainPlatform1Mountain,
      projectMountainPlatform2Mountain,
      projectMountainPlatform3Mountain,
      projectMountainPlatform4Mountain,
      projectMountainRock,
      projectMountainTopHalftMountain,
      projectMountainVueLogo,
      projectMountainClouds
  ]);
  return (
    <group>
      <e.primitive
        editableType="group"
        theatreKey="projectMountainBaseOfProjectMountain"
        object={projectMountainBaseOfProjectMountain.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainBaseOfLevitatingPlatform"
        object={projectMountainBaseOfLevitatingPlatform.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainFloatingDebris"
        object={projectMountainFloatingDebris.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainPlatform1"
        object={projectMountainPlatform1.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainPlatform1Mountain"
        object={projectMountainPlatform1Mountain.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainPlatform2Mountain"
        object={projectMountainPlatform2Mountain.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainPlatform3Mountain"
        object={projectMountainPlatform3Mountain.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainPlatform4Mountain"
        object={projectMountainPlatform4Mountain.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainRock"
        object={projectMountainRock.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainTopHalftMountain"
        object={projectMountainTopHalftMountain.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainVueLogo"
        object={projectMountainVueLogo.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="projectMountainClouds"
        object={projectMountainClouds.scene}
      />
    </group>
  )
}

export default Scene2
