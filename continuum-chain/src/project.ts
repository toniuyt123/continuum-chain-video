import { makeProject } from "@motion-canvas/core";

import example from "./scenes/example?scene";
import RealsAreUncountable from "./scenes/RealsAreUncountable?scene";
import RealNumbersAreUncountableIntro from "./scenes/RealNumbersAreUncountableIntro?scene";
import NaturalsBijections from "./scenes/NaturalsBijections?scene";

import RealsAreUncoutanleAudio from "./audio/real-are-uncountable.mp3";
import test from "./scenes/test?scene";

export default makeProject({
  scenes: [
    /*example,*/
    RealNumbersAreUncountableIntro,
    RealsAreUncountable,
    // NaturalsBijections
  ],
  audio: RealsAreUncoutanleAudio,
});
