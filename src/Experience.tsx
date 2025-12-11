import { Suspense, useEffect } from "react";
import { useScene } from "./store/useSceneStore";
import { scenes } from "./config/scenes";

const Experience = () => {
  const activeScene = useScene((state) => state.activeScene);
  const CurrentScene = scenes[activeScene];

  useEffect(() => {
    console.log(`Entered scene: ${activeScene}`);
  }, [activeScene]);

  return (
    <>

      <Suspense fallback={null}>
        {/* The scene will swap invisibly behind the black overlay */}
        {CurrentScene && <CurrentScene />}
      </Suspense>
    </>
  );
};

export default Experience;
