import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import initialState from "./state/Cryogon.theatre-project-state.json";

if (document.URL.includes("#debug")) {
  studio.initialize();
}
studio.extend(extension);

export const project = getProject("Cryogon", { state: initialState });
export const sheet = project.sheet("default");
