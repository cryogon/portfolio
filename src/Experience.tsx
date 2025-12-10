import { Component, Suspense, useEffect } from "react";
import Main from "./scenes/Main.tsx"
import { useScene } from "./store/useSceneStore.ts";
import { scenes } from "./config/scenes.ts";

const Experience = () => {
  const store = useScene()
  const CurrentScene = scenes[store.activeScene]
  useEffect(() => {
    console.log("hemlo")
  }, [store.activeScene])
  return (
    <Suspense>
      {CurrentScene && <CurrentScene />}
    </Suspense>
  );
};

export default Experience;
