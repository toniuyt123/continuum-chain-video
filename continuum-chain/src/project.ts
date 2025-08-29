import { makeProject } from "@motion-canvas/core";

import example from "./scenes/example?scene";
import RealsAreUncountable from "./scenes/RealsAreUncountable?scene";
import RealNumbersAreUncountableIntro from "./scenes/RealNumbersAreUncountableIntro?scene";
import NaturalsBijections from "./scenes/NaturalsBijections?scene";

import RealsAreUncoutanleAudio from "./audio/real-are-uncountable.mp3";
import test from "./scenes/test?scene";

import sheepToFive from "./scenes/sheepToFive?scene";
import sheepToFIveAudio from "./audio/sheep-to-5.mp3";
import eachNCanonicalSet from "./scenes/eachNCanonicalSet?scene";

export default makeProject({
  scenes: [
    //example,
    // RealNumbersAreUncountableIntro,
    // RealsAreUncountable,
    // NaturalsBijections
    // test,
    sheepToFive,
    eachNCanonicalSet,
  ],
  // audio: RealsAreUncoutanleAudio,
  audio: sheepToFIveAudio,
});
