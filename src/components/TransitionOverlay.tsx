import { useEffect } from "react";
import { useScene } from "../store/useSceneStore";

const TransitionOverlay = () => {
  const { transitionStage, handleFadeInComplete, handleFadeOutComplete } = useScene();
  const DURATION = 1000;

  useEffect(() => {
    let timer: number;

    // Only set timers for state changes
    if (transitionStage === "Start") {
      timer = setTimeout(handleFadeInComplete, DURATION);
    } else if (transitionStage === "Finish") {
      timer = setTimeout(handleFadeOutComplete, DURATION);
    }

    return () => clearTimeout(timer);
  }, [transitionStage, handleFadeInComplete, handleFadeOutComplete]);

  // If we are starting (fading in), opacity is 1. Otherwise (Idle/Finish), it is 0.
  const opacity = transitionStage === "Start" ? 1 : 0;

  // Blocks clicks only when not Idle
  const pointerEvents = transitionStage === "Idle" ? "none" : "auto";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        opacity: opacity, // React updates this, CSS animates it
        zIndex: 9999,
        transition: `opacity ${DURATION}ms ease-in-out`,
        pointerEvents: pointerEvents,
      }}
    />
  );
};

export default TransitionOverlay;
