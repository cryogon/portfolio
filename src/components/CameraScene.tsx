import { useRef, useEffect } from "react";
import {
  useGLTF,
  useAnimations,
  PerspectiveCamera,
  useScroll,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
// import { remapWithMultiplePauses } from "../Utils/Helper";
// import {useScrollSync} from '../Hooks/useScrollSync'


export default function CameraScene() {
  const group = useRef<THREE.Group>(null!);
  const data = useScroll();
  
  const { animations } = useGLTF("models/CameraPath/CameraAnimation.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const actionNames = Object.keys(actions);

    if (actionNames.length > 0) {
      const action = actions[actionNames[0]];
      if (action) action.play().paused = true;
    }
  }, [actions]);

  useFrame((_state, delta) => {
    if (!data || Object.keys(actions).length === 0) return;

    const actionNames = Object.keys(actions);
    if (actionNames.length === 0) return;

    const action = actions[actionNames[0]];
    if (!action) return;
    const currentScroll = data.offset;
    const duration = action.getClip().duration;

    action.time =
    THREE.MathUtils.damp(
      action.time,
      currentScroll * duration,
      4,
      delta,
    );
  });

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <PerspectiveCamera
          name="Camera"
          makeDefault={true}
          far={1000}
          near={0.1}
          fov={40}
          position={[0, 0.136, -14.218]}
          rotation={[0.019, 0.013, 0]}
        />
      </group>
    </group>
  );
}

