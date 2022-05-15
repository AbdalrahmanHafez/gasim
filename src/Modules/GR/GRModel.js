import { default as cfgtocnf } from "../../classes/CFGtoCNF/index";
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

  cykAlgo(str, grammar) {
    // function setupTable(str, grammar, dest) {
    var n = str.length;

    function getTerminalResolution(ch) {
      var tmp = [];
      for (var A in grammar) {
        var r = grammar[A];
        if (r.indexOf(ch) !== -1) {
          tmp.push(A);
        }
      }
      return tmp;
    }

    // $slide.oninput = function () {
    //   var p = +$slide.value;
    //   var c = TL[p];
    //   // Clear all
    //   for (var i = 0; i < $grid.length; i++) {
    //     for (var j = 0; j < $grid[i].length; j++) {
    //       $grid[i][j].style.background = "white";

    //       if (i > 0) {
    //         $grid[i][j].innerHTML = "";
    //       }
    //     }
    //   }

    //   for (var i = 0; i < c.mark.length; i++) {
    //     c.mark[i].style.background = "gold";
    //   }
    //   for (var i = 0; i < c.mark2.length; i++) {
    //     c.mark2[i].style.background = "#ddd";
    //   }

    // for (var i = 0; i < c.set.length; i++) {
    // var s = c.set[i];
    // $grid[s.row][s.col].innerHTML = s.value.join(", ");
    // }
    // };

    // timeline
    // var TL = [{ mark: [], mark2: [], set: [] }];

    var $grid = [];

    var tmp = [];
    var table = document.createElement("table");
    var tr = document.createElement("tr");

    // for (var i = 0; i < n; i++) {
    // var th = document.createElement("th");
    // th.innerHTML = str.charAt(i);
    // table.appendChild(th);
    // tmp.push(th);

    // var set = TL[i].set.slice();
    // set.push({
    //   row: 1,
    //   col: i,
    //   value: getTerminalResolution(str.charAt(i)),
    // });

    // TL.push({ mark: [th], mark2: [], set: set });
    // }
    // $grid.push(tmp);

    // for (var j = 0; j < n; j++) {
    //   var tmp = [];
    //   var tr = document.createElement("tr");

    //   for (var i = 0; i < n - j; i++) {
    //     var td = document.createElement("td");
    //     tr.appendChild(td);
    //     tmp.push(td);
    //   }

    //   table.appendChild(tr);
    //   $grid.push(tmp);
    // }

    function merge(el, B, C) {
      for (var A in grammar) {
        var R = grammar[A];
        for (var b = 0; b < B.length; b++)
          for (var c = 0; c < C.length; c++) {
            if (R.indexOf(B[b] + C[c]) !== -1) {
              el.push(A);
            }
          }
      }
      return el;
    }

    // var tl = TL.length - 1;

    // Setup CYK lookup table
    var T = new Array(n);
    T[0] = [];

    for (var j = 0; j < n; j++) {
      T[0].push(getTerminalResolution(str[j]));
    }

    for (var j = 1; j < n; j++) {
      T[j] = [];
      for (var i = 0; i < n - j; i++) {
        T[j][i] = [];

        for (var k = 0; k < j; k++) {
          T[j][i] = merge(T[j][i], T[k][i], T[j - k - 1][i + k + 1]);

          // var set = TL[tl++].set.slice();
          // set.push({ row: j + 1, col: i, value: T[j][i].slice() });

          // TL.push({
          //   mark2: [$grid[j + 1][i]],
          //   mark: [$grid[k + 1][i], $grid[j - k - 1 + 1][i + k + 1]],
          //   set: set,
          // });
        }
      }
    }

    // console.log("TL is ", TL);
    console.log("T is ", T);

    return T;

    // $slide.setAttribute("max", TL.length - 1);

    // dest.appendChild(table);

    // }
  }

  isDerivable(targetString) {
    const cfg = {};
    this.productions.forEach((prod) => {
      const alreadyThere = cfg[prod[0]] ? cfg[prod[0]] : [];
      const toPush = prod[1] === "" ? "ε" : prod[1];
      alreadyThere.push(toPush);
      cfg[prod[0]] = alreadyThere;
    });
    console.log("cfg", cfg);

    let result = cfgtocnf(cfg);

    console.log("result is ", JSON.stringify(result));

    if (Object.keys(result).includes("$")) {
      let alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

      const updateAlphabet = (char) => {
        if (char.toUpperCase() === char) {
          // console.log("considering", char);
          if (alphabet.includes(char)) {
            // console.log("removing", char);
            alphabet.splice(alphabet.indexOf(char), 1);
          }
        }
      };

      for (let key of Object.keys(result)) {
        const arr = result[key];
        updateAlphabet(key);
        // console.log("starting key ", key);
        // console.log("its array is ", arr);
        for (let elm of arr) {
          elm.split("").forEach((e) => updateAlphabet(e));
        }
      }

      console.log("alphabet after is ", alphabet);

      const renameKey = (from, to) => {
        result = { ...result, [to]: result[from] };
        delete result[from];
      };

      const ckey = alphabet.shift();
      for (let i = 0; i < result["S"].length; i++) {
        // S -> ..S..S ---> k -> ..k...k
        const str = result["S"][i].replace("S", ckey);
        result["S"][i] = str;
      }

      for (let i = 0; i < result["$"].length; i++) {
        // $ -> ..S..S ---> $ -> ..k...k
        const str = result["$"][i].replace("S", ckey);
        result["$"][i] = str;
      }

      console.log("ckey", ckey);
      renameKey("S", ckey);
      renameKey("$", "S");

      console.log("new result is ", result);
    }

    const grammar = {
      S: ["AB"],
      A: ["a"],
      B: ["b"],
    };

    const table = this.cykAlgo(targetString, result);
    // this.cykAlgo("abcc", grammar);
    for (let arr of table[table.length - 1]) {
      if (arr.includes("S")) {
        console.log("DERIVABLE");
        return true;
      }
    }

    console.log("NOT DERIVABLE");
    return false;
  }
}
