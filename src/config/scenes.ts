import React from "react";
import { type Scene } from "../store/useSceneStore";

export const scenes: Record<Scene, any> = {
  "Main": React.lazy(() => import("../scenes/Main.tsx")),
  "ProjectCave": React.lazy(() => import("../scenes/Test.tsx")),
  "ContactUs": "",
  "ExperienceCave": ""
}
