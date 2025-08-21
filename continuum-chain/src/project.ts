import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';
import RealsAreUncountable from './scenes/RealsAreUncountable?scene';
import NaturalsBijections from './scenes/NaturalsBijections?scene';

export default makeProject({
  scenes: [
    /*example,*/ 
    //RealsAreUncountable,
    NaturalsBijections
  ],
});
