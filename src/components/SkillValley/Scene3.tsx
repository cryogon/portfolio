import { useGLTF } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";

const Scene3 = () => {
  const aboutValleyCaveAndMountains = useGLTF("/models/Scene3/CaveAndMountain.glb");
  const aboutValleySkillIcons = useGLTF("/models/Scene3/SkillIcons.glb");
  const aboutValleyTerrain = useGLTF("/models/Scene3/Terrain.glb");
  const aboutValleyPillars = useGLTF("/models/Scene3/ValleyPillars.glb");

  return (
    <group>
      <e.primitive
        editableType="group"
        theatreKey="aboutValleyCaveAndMountains"
        object={aboutValleyCaveAndMountains.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="aboutValleySkillIcons"
        object={aboutValleySkillIcons.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="aboutValleyPillars"
        object={aboutValleyPillars.scene}
      />
      <e.primitive
        editableType="group"
        theatreKey="aboutValleyTerrain"
        object={aboutValleyTerrain.scene}
      />
    </group>
  );
};

export default Scene3;
