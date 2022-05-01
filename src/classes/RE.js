// Precedence: ∗ > ◦ > ∪
// OPs: [ concat , pipe , star , plus , none ]
//  (a*(b|c))+(d)

export default class RE {
  constructor(expression) {
    this.expression = expression;
  }

  // static star = /\(.+\)\*|.\*/gm;
  // static plus = /\(.+\)\+|.\+/gm;
  // static pipe = //gm;

  /**
   *   { [{ [{[{[a],op:star}, {[ {[b] ,op:none} , {[c], op:none}],op:pipe}] ,op:concat},],op: plus}, { [d],op: none}      ] ,op: concat }
   */

  // (b|c)*
  // layer 1: { [ { [b] ,op:none} , { [c] ,op:none} ], op:* } <-----this representation i guess,
  /**
   *     {[
   *     {
   *        [
   *          { [b] ,op:none }
   *           , { [c] ,op:none }
   *        ]
   *    , op: | }
   *    ] , op:* }
   *
   *    exp = { [exps], op }
   */
}
