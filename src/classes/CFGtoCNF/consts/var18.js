import { S, EPSILON } from './consts';
export const cfg = {
    [S]: ['aB', 'bA', 'B'],
    'A': ['b', 'aD', `A${S}`, 'bAB', EPSILON],
    'B': ['a', `b${S}`],
    'C': ['AB'],
    'D': ['BB'],
};
