import * as THREE from "three";
import cloudVertexShader from "../shaders/clouds/vert.glsl?raw";
import cloudFragmentShader from "../shaders/clouds/frag.glsl?raw";
import { useMemo } from "react";

export default function CloudScreen() {
  const cloudMatrial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      side:THREE.BackSide,
      transparent:true
    });
  }, []);

  return (
    <mesh material={cloudMatrial}>
      <boxGeometry args={[2, 2, 2]} />
    </mesh>
  );
}
