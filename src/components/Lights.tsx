import { editable as e } from "@theatre/r3f";

const Lights = () => {

  return (
    <>
      <e.ambientLight
        theatreKey="ambientLight"
        intensity={1}
        color={"#ff257a"}
      />
      <e.directionalLight
        theatreKey="directionalLight1-Shadow"
        position={[0, 0, 0]}
        intensity={1}
        castShadow
        shadow-bias={-0.0001}
        color={"#ffffff"}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-top={500} shadow-camera-bottom={-500}
        shadow-camera-left={-500}
        shadow-camera-right={500}
        shadow-camera-near={0.5}
        shadow-camera-far={5000}
      />
      <e.directionalLight
        theatreKey="directionalLight-NO-Shadow"
        position={[0, 0, 0]}
        intensity={1}
        color={"#ffffff"}
      />

      <e.pointLight theatreKey="pointLight" />
    </>
  );
};

export default Lights;
