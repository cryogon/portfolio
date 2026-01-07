import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import { editable as e } from "@theatre/r3f";
import { Instances, Instance } from "@react-three/drei";
import { seededRandom } from "../../utils/seededRandom";

const Tree = () => {
  const homeMountainTreeHome = useGLTF("/models/Tree_Home.glb");
  const { nodes } = useGLTF('/models/Scene1/Petal.glb') as any
  const count = 60;
  const instancesRef = useRef<THREE.InstancedMesh>(null!);

  const initialPositions = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: seededRandom() * 50,
        y: seededRandom() * 40,
        z: seededRandom() * 50,
        initialX: seededRandom() * 50,
        initialY: seededRandom() * 40,
        initialZ: seededRandom() * 10,
        fallSpeed: 0.5 + seededRandom() * 1.5,
        driftSpeed: 1 + seededRandom(),
        swaySpeed: 0.5 + seededRandom() * 1.5,
        swayAmount: 0.5 + seededRandom() * 1,
        rotationX: seededRandom() * Math.PI * 2,
        rotationY: seededRandom() * Math.PI * 2,
        rotationZ: seededRandom() * Math.PI * 2,
        rotationSpeedX: (seededRandom() - 0.5) * 2,
        rotationSpeedY: (seededRandom() - 0.5) * 2,
        rotationSpeedZ: (seededRandom() - 0.5) * 3,
        scale: 0.5 + seededRandom() * 0.3
      });
    }
    return temp;
  }, [count]);

  const positions = useRef(initialPositions.map(pos => ({ ...pos })));

  useFrame((state, delta) => {
    if (!instancesRef.current) return;

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();

    for (let i = 0; i < count; i++) {
      const leaf = positions.current[i];

      leaf.y -= leaf.fallSpeed * delta;
      leaf.x -= leaf.driftSpeed * delta;

      leaf.rotationX += leaf.rotationSpeedX * delta;
      leaf.rotationY += leaf.rotationSpeedY * delta;
      leaf.rotationZ += leaf.rotationSpeedZ * delta;

      if (leaf.y < 0) {
        leaf.y = 40;
        leaf.x = leaf.initialX;
        leaf.z = leaf.initialZ;
      }

      const swayZ = Math.sin(state.clock.elapsedTime * leaf.swaySpeed) * leaf.swayAmount;

      euler.set(leaf.rotationX, leaf.rotationY, leaf.rotationZ);
      quaternion.setFromEuler(euler);

      matrix.compose(
        new THREE.Vector3(leaf.x, leaf.y, leaf.z + swayZ),
        quaternion,
        new THREE.Vector3(leaf.scale, leaf.scale, leaf.scale)
      );
      instancesRef.current.setMatrixAt(i, matrix);
    }

    instancesRef.current.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => {
    const models = [homeMountainTreeHome];
    models.forEach((model) => {
      model.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    });
  }, [homeMountainTreeHome]);

  const leafMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#AA336A"
  }), []);

  useEffect(() => {
    return () => {
      leafMaterial.dispose();
    };
  }, [leafMaterial]);

  return (
    <>
      <e.primitive
        editableType="group"
        theatreKey="HomeMountainTreeHome"
        object={homeMountainTreeHome.scene}
      />
      <e.group theatreKey="HomeMountainTreeLeaves">
        <Instances
          ref={instancesRef}
          limit={count}
          geometry={nodes['Petal(pink)001'].geometry}
          material={leafMaterial}
        >
          {initialPositions.map((position, i) => (
            <Instance
              key={i}
              position={[position.x, position.y, position.z]}
              scale={[0.5, 0.5, 0.5]}
            />
          ))}
        </Instances>
      </e.group>
    </>
  );
};

export default Tree;
