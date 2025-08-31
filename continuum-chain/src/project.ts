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

import sheepStory from "./scenes/sheepStory?scene";
import sheRealized from "./scenes/sheRealized?scene";
import sheepStoryAudio from "./audio/sheep_story.mp3";

import chainIntro from "./scenes/chainIntro?scene";
import chainIntroAudio from "./audio/chainIntro.mp3";

import pn from "./scenes/pn?scene";
import pnAudio from "./audio/pn.mp3";
import pnLattice from "./scenes/pnLattice?scene";

import rationalDensity from "./scenes/rationalDensity?scene";
import rationalDensityAudio from "./audio/densityIntro.mp3";

import realsDensity from "./scenes/realsDensity?scene";
import realsDensityAudio from "./audio/relsDensity.mp3";
import construction from "./scenes/construction?scene";
import butItWasAboutNaturals from "./scenes/butItWasAboutNaturals?scene";
import constructionAudio from "./audio/continuum-chain-construction.mp3";
import goingBackToBijection from "./scenes/goingBackToBijection?scene";
import whatDoesItLookLike from "./scenes/whatDoesItLookLike?scene";
import inTheDiagram from "./scenes/inTheDiagram?scene";

export default makeProject({
  scenes: [
    // example,
    // RealNumbersAreUncountableIntro,
    // NaturalsBijections,
    // test,
    // sheepToFive,
    // eachNCanonicalSet,
    // emptySet,
    whenIsFinite,
    // infiniteExamples,
    // powerSetIntroduction,
    // example,
    //roadmap,
    //sheepStory,
    //sheRealized,
    //sheepToFive,
    // chainIntro,
    //rationalDensity,
    //realsDensity,

    construction,
    butItWasAboutNaturals,
    goingBackToBijection,
    whatDoesItLookLike,
    inTheDiagram,
  ],
  audio: constructionAudio,
});
