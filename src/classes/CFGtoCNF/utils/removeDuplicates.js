import { structuredClone } from './index';
// remove duplicates in states
// e.g S -> aA | aA, is S -> aA
const removeDuplicates = (grammar) => {
    let cfg = structuredClone(grammar);
    for (let s in cfg) {
        const arr = cfg[s];
        cfg[s] = [...new Set(arr)];
    }
    return cfg;
};
export default removeDuplicates;
