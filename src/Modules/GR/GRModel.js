class ParseNode {
  constructor(derivation, productions, substiutions) {
    this.derivation = derivation;
    this.productions = productions;
    this.substiutions = substiutions;

    this.parent = null;
    this.children = [];
  }
  clone() {
    return new ParseNode(this.derivation, this.productions, this.substiutions);
  }
}

export class GrammarParser {
  #alreadyAdded;
  #posibilityPrederived;
  constructor(grammar) {
    this.grammar = grammar;
    this.productions = grammar.productions;
    this.initalNode = new ParseNode("S", [], []);
    this.target = null;
    this.queue = [this.initalNode];
    this.solutionNode = null;

    this.#alreadyAdded = [];
    this.#posibilityPrederived = {};

    // UI
    this.consideredNodesCtr = 0;
    this.paused = false;
  }
  getPossibilities(derivation) {
    if (Object.keys(this.#posibilityPrederived).includes(derivation)) {
      return this.#posibilityPrederived[derivation];
    }
    const possibilities = [];
    if (derivation.length === 0) {
      possibilities.push(new ParseNode("", [], []));
      return possibilities;
    }

    const alreadyEncountered = new Set();
    const productions = this.productions;

    for (let i = -1; i < productions.length; i++) {
      const prod =
        i === -1
          ? [derivation.substring(0, 1), derivation.substring(0, 1)]
          : productions[i];
      // Find the start of the production.
      const start = derivation.indexOf(prod[0]);
      const lengthSubs = prod[0].length;
      if (start === -1) continue;
      const list = this.getPossibilities(
        derivation.substring(start + lengthSubs)
      );
      const prepend = derivation.substring(0, start) + prod[1];
      const lengthReplace = start + prod[0].length;
      // Make adjustments for each entry.
      for (let node of list) {
        const d = node.derivation;
        const p = node.productions;
        const a = prepend + d;
        const s = node.substiutions;
        if (i === -1) {
          const newS = new Array(s.length).fill(0);
          for (let j = 0; j < p.length; j++) newS[j] = s[j] + lengthReplace;

          // Make the node with the substitution.
          if (!alreadyEncountered.has(a)) {
            alreadyEncountered.add(a);
            node = new ParseNode(a, p, newS);
            possibilities.push(node);
            this.consideredNodesCtr++;
          }
        } else {
          const newP = new Array(p.length + 1).fill("");
          const newS = new Array(s.length + 1).fill(0);
          newS[0] = start;
          newP[0] = prod;
          for (let j = 0; j < p.length; j++) {
            newP[j + 1] = p[j];
            newS[j + 1] = s[j] + lengthReplace;
          }
          // Make the node with the substitution.
          if (!alreadyEncountered.has(a)) {
            alreadyEncountered.add(a);
            node = new ParseNode(a, newP, newS);
            possibilities.push(node);
            this.consideredNodesCtr++;
          }
        }
      }
    }
    this.#posibilityPrederived[derivation] = possibilities;
    return possibilities;
  }

  isPossiableDerivation(derivation) {
    // NOTE: MAYBE
    /**
     * unrestricted grammers allow more than one symbol in 'from'
     * only restricted grammers the method isPossiableDerivation runs over
     */
    return true;
  }
  #parse() {
    // debugger;
    const node = this.queue.shift();
    const possibilities = this.getPossibilities(node.derivation);
    for (let pNode of possibilities) {
      const derivation = pNode.derivation;
      if (this.#alreadyAdded.includes(derivation)) continue;
      if (!this.isPossiableDerivation(derivation)) continue;
      this.#alreadyAdded.push(derivation);

      const child = pNode.clone();
      child.parent = node;
      node.children.push(child);

      this.queue.push(child);
      this.consideredNodesCtr++;

      if (pNode.derivation === this.target) {
        // console.log("Found the target");

        pNode.parent = node;
        this.queue = [];
        this.solutionNode = pNode;
        return;
      }
    }

    // MAYBE: redundant parent removeval
  }

  parse(input) {
    this.target = input;
    while (this.queue.length !== 0 && !this.paused) {
      console.log("Tick");
      this.#parse();
    }
  }

  #replaceAt(s, i, c) {
    const arr = [...s]; // Convert string to array
    arr[i] = c; // Set char c at pos i
    return arr.join(""); // Back to string
  }

  getAnswer() {
    const simResult = [];
    const display = [[[], "S"]];
    let current = this.solutionNode;
    do {
      simResult.push(current);
      current = current.parent;
    } while (current !== null);

    simResult.reverse();
    // console.log(simResult);

    for (let node of simResult) {
      if (!node.parent) continue;
      //has a parent
      const string = node.parent.derivation;
      let stringSegs = string.split("");
      const productions = node.productions;
      const substiutions = node.substiutions;
      for (let i = 0; i < stringSegs.length; i++) {
        const found = substiutions.indexOf(i);
        if (found !== -1) {
          const replaceCout = productions[found][0].length;
          const replaceWith = productions[found][1];
          stringSegs.splice(i, replaceCout, replaceWith);
          const curString = stringSegs.join("");
          display.push([productions[found], curString]);
        }
      }
    }

    // console.log("display is", display);
    // printing what display is
    // display.forEach(([prod, string]) => {
    //   const from = prod[0];
    //   const to = prod[1];
    //   console.log(`${from} -> ${to} = ${string}`);
    // });

    // return simResult;
    console.log(simResult);
    return display;
  }
}

export default class GRModel {
  constructor(productions) {
    this.productions = productions;
  }

  bruteForceTo(input) {
    const parser = new GrammarParser(this);
    parser.parse(input);
    return parser.getAnswer();
  }
}
