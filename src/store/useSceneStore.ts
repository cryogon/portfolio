import { create } from 'zustand';

export type Scene = "Main" | "ProjectCave" | "ExperienceCave" | "ContactUs";
// Stages: Idle -> Start (Fade In) -> Animating (Hold Black/Swap) -> Finish (Fade Out) -> Idle
export type TransitionStage = "Idle" | "Start" | "Animating" | "Finish";

interface SceneStore {
  activeScene: Scene;
  nextScene: Scene | null;
  transitionStage: TransitionStage;

  // Actions
  triggerTransition: (targetScene: Scene) => void;
  handleFadeInComplete: () => void;
  handleFadeOutComplete: () => void;
}

export const useScene = create<SceneStore>((set) => ({
  activeScene: "Main",
  nextScene: null,
  transitionStage: "Idle",

  triggerTransition: (targetScene) => set((state) => {
    // Prevent double triggering
    if (state.transitionStage !== "Idle" || state.activeScene === targetScene) return state;
    return {
      nextScene: targetScene,
      transitionStage: "Start"
    };
  }),

  // Overlay is fully black: Swap the scenes now
  handleFadeInComplete: () => set((state) => ({
    activeScene: state.nextScene as Scene, // Swap happens here
    nextScene: null,
    transitionStage: "Finish" // Start fading out
  })),

  // Overlay is transparent again: Reset to Idle
  handleFadeOutComplete: () => set({
    transitionStage: "Idle"
  })
}));
