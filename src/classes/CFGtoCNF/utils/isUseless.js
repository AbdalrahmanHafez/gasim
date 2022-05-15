import { structuredClone } from './index';
const isUseless = (grammar, stateToCheck) => {
    const cfg = structuredClone(grammar);
    for (let s in cfg) {
        const arr = cfg[s];
        for (let state of arr) {
            if (s !== stateToCheck) {
                let splited = state.split('');
                if (splited.includes(stateToCheck)) {
                    return false;
                }
            }
        }
    }
    return true;
};
export default isUseless;
