import React from "react";
import { type Scene } from "../store/useSceneStore";

export const scenes: Record<Scene, React.LazyExoticComponent<React.ComponentType<any>> | null> = {
  "Main": React.lazy(() => import("../scenes/Main.tsx")),
  "ProjectCave": React.lazy(() => import("../scenes/Test.tsx")),
  "ContactUs": null,
  "ExperienceCave": null
}
