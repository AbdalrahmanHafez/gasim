import { S, EPSILON } from './consts';
export const cfg = {
    [S]: ['abAB'],
    'A': [`a${S}ab`, `B${S}`, 'aA', 'b'],
    'B': ['BA', 'ababB', 'b', EPSILON],
    'C': [`A${S}`],
};
