import { Sparkles, useGLTF } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";
import * as THREE from "three";

const Lamps = () => {
  const lampsModels = [
    useGLTF("/models/Lamp1.glb"),
    useGLTF("/models/Lamp2.glb"),
    useGLTF("/models/Lamp3.glb"),
  ];

  const centerValue = (value1: number, value2: number): number => {
    return (value1 + value2) / 2;
  };

  const getCoordinations = (model: any): THREE.Vector3 => {
    if(!("scene" in model))return new THREE.Vector3(0,0,0) 

    const scene = model.scene as THREE.Object3D;

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size); // Populates the 'size' vector

    const center = new THREE.Vector3();
    box.getCenter(center); // Populates the 'center' vector

    return new THREE.Vector3(
      centerValue(box.max.x, box.min.x),
      box.min.y,
      centerValue(box.max.z, box.min.z),
    );
  };

  return (
    <>
      {lampsModels.map((model, index) => {
        return (
          <group>
            <e.primitive
              editableType="group"
              theatreKey={`homeMountainLamp-${index}`}
              object={model.scene}
            />
            <e.group
              theatreKey={`homeMountainLampParticles-${index}`}
              position={getCoordinations(model)}
            >
              <Sparkles
                count={18}
                speed={1}
                size={30}
                opacity={1}
                color={"#00fff7"}
                scale={[4, 4, 4]}
              />
            </e.group>
          </group>
        );
      })}
    </>
  );
};

export default Lamps;
