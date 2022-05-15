import { EPSILON, S } from '../consts/consts';
// if some state derives epsilon return true 
const hasEpsilon = (grammar) => {
    for (let s in grammar) {
        let arr = grammar[s];
        for (let el of arr) {
            if (el === EPSILON && s !== S)
                return true;
        }
    }
    return false;
};
export default hasEpsilon;
