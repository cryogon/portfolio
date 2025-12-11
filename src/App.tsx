import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import Lights from "./components/Lights";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
import { Perf } from "r3f-perf";
import initialState from "./state/Cryogon.theatre-project-state.json";
import * as THREE from "three";
import { useScene } from "./store/useSceneStore";
import TransitionOverlay from "./components/TransitionOverlay";


if (document.URL.includes("#debug")) {
  studio.initialize();
}
studio.extend(extension);
const sheet = getProject("Cryogon", { state: initialState }).sheet("default");


function DebugButton() {
  const triggerTransition = useScene((state) => state.triggerTransition);

  if (document.URL.includes("#debug")) {
    return <button onClick={() => triggerTransition("ProjectCave")}>Enter Cave</button>

  }
  return <></>
}

const App = () => {
  return (
    <>
      <DebugButton />
      <TransitionOverlay />
      <Canvas
        shadows
        dpr={2}
        gl={{
          preserveDrawingBuffer: true,
          toneMapping: THREE.AgXToneMapping,
        }}
      >
        <Perf position="top-right" />
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
