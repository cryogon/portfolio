import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Lights from "./components/Lights";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
import { Perf } from "r3f-perf";
import initialState from "./state/Cryogon.theatre-project-state.json";
import * as THREE from "three";


document.URL.includes("#debug") && studio.initialize();
studio.extend(extension);
const sheet = getProject("Cryogon", { state: initialState }).sheet("default");

const geo = new THREE.BoxGeometry()


const App = () => {
  return (
    <>
      <Canvas
        shadows
        gl={{
          preserveDrawingBuffer: true,
          toneMapping: THREE.AgXToneMapping,
        }}
      >
        <Perf position="top-left" />
        <SheetProvider sheet={sheet}>
          <color args={["#a96081"]} attach="background" />
          <PerspectiveCamera
            theatreKey="Camera"
            makeDefault
            // position={[-62,561,-369]}
            position={[-35, 381, 514]}
            rotation={[80, 0, 148]}
            fov={75}
          />
          <Lights />
          <Experience />
        </SheetProvider>
      </Canvas>
    </>
  );
};

export default App;
