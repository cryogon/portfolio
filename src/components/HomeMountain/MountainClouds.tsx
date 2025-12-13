import CloudLayer1 from "./Clouds/CloudLayer1";
import CloudLayer2 from "./Clouds/CloudLayer2";
import CloudLayer3 from "./Clouds/CloudLayer3";
import CloudLayer4 from "./Clouds/CloudLayer4";

export default function MountainClouds() {
  return (
    <group>
    <CloudLayer1/>
      <CloudLayer2/>
      <CloudLayer3/>
      <CloudLayer4/>
    </group>
  );
}
