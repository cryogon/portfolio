import { create } from 'zustand'

export type Scene = "Main" | "ProjectCave" | "ExperienceCave" | "ContactUs"
export type TransitionStage = "Idle" | "Start" | "Animating" | "Finish";

interface SceneStore {
  activeScene: Scene;
  nextScene: Scene | null;
  transitionStage: TransitionStage;
  setScene: (scene: Scene) => void;
}


export const useScene = create<SceneStore>((set) => ({
  activeScene: "Main",
  nextScene: null,
  transitionStage: "Idle",
  setScene: (scene) => set(() => ({ activeScene: scene }))
}))

