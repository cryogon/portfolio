import { useEffect, useRef } from 'react'
import { useGLTF, PerspectiveCamera, useAnimations } from '@react-three/drei'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


export default function CameraScene() {
  const group = useRef<THREE.Group>(null!)
  const { animations } = useGLTF('models/CameraPath/CameraAnimationFirstCut.glb')
  const { actions } = useAnimations(animations, group)
  const scrollData = useScroll()


  useEffect(() => {
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      const action = actions[actionNames[0]];
      if (action) action.play().paused = true;
    }
  }, [actions])

  useFrame((_state, delta) => {

    if (!scrollData || Object.keys(actions).length === 0) return;

    const actionNames = Object.keys(actions);
    if (actionNames.length === 0) return;

    const action = actions[actionNames[0]];
    if (!action) return;
    const currentScroll = scrollData.offset;
    const duration = action.getClip().duration;

    action.time =
      THREE.MathUtils.damp(
        action.time,
        currentScroll * duration,
        4,
        delta,
      );


  })

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <PerspectiveCamera
          name="Camera_HomeMount"
          makeDefault={true}
          far={7000}
          near={0.1}
          fov={37.299}
          position={[-35.134, 513.666, -381.263]}
          rotation={[-3.108, -0.027, -3.141]}
          scale={12.711}
        />
      </group>
    </group>
  )
}

