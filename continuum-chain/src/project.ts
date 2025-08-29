import { makeProject } from "@motion-canvas/core";

import example from "./scenes/example?scene";
import RealsAreUncountable from "./scenes/RealsAreUncountable?scene";
import RealNumbersAreUncountableIntro from "./scenes/RealNumbersAreUncountableIntro?scene";
import NaturalsBijections from "./scenes/NaturalsBijections?scene";
import NaturalsBijectionsAudio from "./audio/naturals-bijections.mp3";

import RealsAreUncoutanleAudio from "./audio/real-are-uncountable.mp3";
import test from "./scenes/test?scene";

import sheepToFive from "./scenes/sheepToFive?scene";
import sheepToFIveAudio from "./audio/sheep-to-5.mp3";
import eachNCanonicalSet from "./scenes/eachNCanonicalSet?scene";

import emptySet from "./scenes/emptySet?scene";
import whenIsFinite from "./scenes/whenIsFinite?scene";
import infiniteExamples from "./scenes/infiniteExamples?scene";
import emptySetAndWhatIsFiniteAudio from "./audio/empty_what_is_finite.mp3";

import powerSetIntroduction from "./scenes/powerSetIntroduction?scene";
import powerSetIntroductionAudio from "./audio/power-set-introduction.mp3";

import roadmap from "./scenes/roadmap?scene";
import introAudio from "./audio/intro.mp3";

export default makeProject({
  scenes: [
    //example,
    // RealNumbersAreUncountableIntro,
    // RealsAreUncountable,
    NaturalsBijections,
    // test,
    // sheepToFive,
    // eachNCanonicalSet,
    // emptySet,
    // whenIsFinite,
    // infiniteExamples,
    // powerSetIntroduction,
    // example,
    //roadmap,
  ],
  audio: NaturalsBijectionsAudio,
});
