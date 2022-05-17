import { S, EPSILON } from "./consts";
export const cfg = {
    [S]: ['ASB', EPSILON],
    'A': ['aAS', 'a', EPSILON],
    'B': ['SbS', 'A', 'bb'],
};

// export const cfg = {
//   [S]: ["AB"],
//   A: ["aA", EPSILON],
//   B: ["bB", EPSILON],
// };

/**
 *
 
S → ASB | ?ε
A → aAS|a|ε
B → SbS|A|bb

 *
 */
