import { useGLTF } from "@react-three/drei"
import { editable as e } from "@theatre/r3f"
import { Sparkles } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from 'three'

const centerValue=(value1:number,value2:number):number=>{
  return (value1+value2)/2
}

const LetterBox = () => {
  const homeMountainLetterBox = useGLTF("/models/LetterBox.glb");

  const {box} = useMemo(()=>{
    const scene=homeMountainLetterBox.scene

    const box=new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size) // Populates the 'size' vector
    
    const center = new THREE.Vector3()
    box.getCenter(center) // Populates the 'center' vector
    return {box,size,center}
  },[homeMountainLetterBox])

  
  const particlesLocation=new THREE.Vector3(centerValue(box.max.x,box.min.x),box.max.y,centerValue(box.max.z,box.min.z))


  return (
    <>
      <e.primitive
        editableType="group"
        theatreKey="homeMountainLetterBox"
        object={homeMountainLetterBox.scene}
      />
      <e.group theatreKey="Sparkles1" position={particlesLocation}> 
        <Sparkles
          count={18}
          speed={1}
          size={30}
          opacity={1}
          color={"#00fff7"}
          scale={[4,4,4]}
        />
      </e.group>
    </>
  )
}

export default LetterBox
