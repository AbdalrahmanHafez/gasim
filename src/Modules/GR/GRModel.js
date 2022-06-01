import { isNumber } from "../../utils";

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

    this.smaller = this.smallerSymbols(grammar); // is a set
    this.isUnrestricted = this.isUnrestricted();

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

  isUnrestricted() {
    const prods = this.grammar.productions;
    for (let i = 0; i < prods.length; i++)
      if (prods[i][0].length !== 1) return true;
    return false;
  }

  minimumLength(string, smaller) {
    let length = 0;
    for (let j = 0; j < string.length; j++)
      if (!smaller.has(string.substring(j, j + 1))) length++;
    return length;
  }

  count(s, c) {
    let count = 0;
    for (let i = 0; i < s.length; i++) if (s.charAt(i) === c) count++;
    return count;
  }

  smallerSymbols(grammar) {
    const smaller = new Set();
    const prods = grammar.productions;
    let added;
    do {
      added = false;
      for (let i = 0; i < prods.length; i++) {
        const left = prods[i][0];
        const right = prods[i][1];
        const rightLength = this.minimumLength(right, smaller);
        const leftLength = this.minimumLength(left, smaller);
        if (leftLength > rightLength) {
          for (let j = 0; j < left.length; j++) {
            const symbol = left.substring(j, j + 1);
            const s = symbol.charAt(0);
            if (smaller.has(symbol)) continue;
            if (this.count(left, s) <= this.count(right, s)) continue;
            smaller.add(symbol);
            added = true;
          }
        }
      }
    } while (added);
    return smaller;
  }

  isLeafNode(node) {
    return node.children.length === 0;
  }

  removeFutility(node) {
    console.log("started to remove futility");
    try {
      while (this.isLeafNode(node)) {
        // ((ParseNode) node.getParent()).remove(node);
        const parent = node.parent;
        console.log("children before ", parent.children.length);
        parent.children = parent.children.filter((child) => child !== node);
        console.log("children after ", parent.children.length);

        // deletedNodes++;
        // node = (ParseNode) node.getParent();
        node = parent;
      }
    } catch (error) {
      // The parent didn't exist, so we're done.
    }
    console.log("DONE to remove futility");
  }

  isPossiableDerivation(derivation) {
    // NOTE: MAYBE
    /**
     * unrestricted grammers allow more than one symbol in 'from'
     * only restricted grammers the method isPossiableDerivation runs over
     */

    if (this.isUnrestricted) {
      // unrestricted check
      const res =
        this.minimumLength(derivation, this.smaller) <= this.target.length;
      // console.log("isPossiableDerivation", res);

      return res;
      // return this.minimumLength(derivation, this.smaller) <= this.target.length;
    } else {
      // Restricted check

      if (this.minimumLength(derivation, this.smaller) > this.target.length) {
        // console.log("isPossiableDerivation", false);
        return false;
      }

      let startBookend = false;
      let endBookend = false;
      const discrete = [];
      let sb = "";
      let start = -1;

      /*
       * Set the start and end "bookeneds", that is, the derivation is padded
       * with terminals on either it's left or right sides.
       */

      const isVariable = (s) => s.toUpperCase() === s;

      const isTerminal = (s) => !isVariable(s);

      if (derivation.length === 0) {
        startBookend = false;
        endBookend = false;
      } else {
        startBookend = !isVariable(derivation.substring(0, 1));
        endBookend = !isVariable(
          derivation.substring(derivation.length - 1, derivation.length)
        );
      }

      /* Break up groups of terminals into the "discrete" array. */
      for (let i = 0; i <= derivation.length; i++) {
        const symbol =
          i === derivation.length ? null : derivation.substring(i, i + 1);
        if (symbol == null || isVariable(symbol)) {
          // if (symbol == null) endBookend = true;
          if (sb.length === 0) continue;
          if (start === -1) continue;
          discrete.push(derivation.substring(start, i));
          start = -1;
        } else if (isTerminal(symbol)) {
          if (start === -1) start = i;
          sb += symbol;
          // if (i==0) startBookend = true;
        }
      }
      let cp = 0;
      for (let i = 0; i < discrete.length; i++) {
        const e = discrete[i];
        if (startBookend && i === 0) {
          if (!this.target.startsWith(e)) return false;
          cp = e.length;
        } else if (endBookend && i === discrete.length - 1) {
          if (!this.target.endsWith(e)) return false;
        } else {
          cp = this.target.indexOf(e, cp);
          if (cp === -1) return false;
          cp += e.length;
        }
      }

      // console.log("isPossiableDerivation", true);
      return true;
    }
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
        pNode.parent = node;
        this.queue = [];
        this.solutionNode = pNode;

        console.log("Found the target, solution node is", this.solutionNode);
        return;
      }
    }

    if (this.isLeafNode(node)) {
      this.removeFutility(node);
    }
  }

  parse(input) {
    this.target = input;
    let counter = 0;
    while (this.queue.length !== 0 && !this.paused) {
      console.log("Tick");
      this.#parse();

      if (counter++ === 10000) {
        alert("Loop protection limit reached, aborting");
        break;
      }
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

    if (current === null) return null;

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

    // console.log("T is ", T);

    return T;

    // $slide.setAttribute("max", TL.length - 1);

    // dest.appendChild(table);

    // }
  }

  isDerivable(targetString) {
    const log = (cfg, msg = "") => {
      let toPrint = "";
      for (let [key, value] of Object.entries(cfg)) {
        toPrint += `${key} -> ${value.join("|")}\n`;
      }
      // console.log(JSON.stringify(cfg, null, 1));

      console.log(msg + "\n" + toPrint);
    };

    const cfg = {};
    this.productions.forEach((prod) => {
      const alreadyThere = cfg[prod[0]] ? cfg[prod[0]] : [];
      const toPush = prod[1] === "" ? "ε" : prod[1];
      alreadyThere.push(toPush);
      cfg[prod[0]] = alreadyThere;
    });
    // console.log("input cfg is", cfg);
    log(cfg, "input cfg is");

    const CFGtoCNF = (cfg) => {
      // ε

      const getUniqueAlpha = (cfg) => {
        // TODO: the whole isDeriable depends on this, small set of variables 26 chars. consider a generic naming scheme
        let alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

        const updateAlphabet = (char) => {
          if (char.toUpperCase() === char) {
            if (alphabet.length === 0)
              throw new Error(
                "Couldn't generate a unique variable for the CNF Grammar"
              );

            if (alphabet.includes(char)) {
              alphabet.splice(alphabet.indexOf(char), 1);
            }
          }
        };

        for (let [key, arr] of Object.entries(cfg)) {
          updateAlphabet(key);
          for (let elm of arr) {
            elm.split("").forEach((e) => updateAlphabet(e));
          }
        }

        // console.log("alphabet after is ", alphabet);
        const avAlpha = alphabet.shift();
        return avAlpha;
      };

      const newStartSymbol = (cfg) => {
        for (let [value] of Object.values(cfg)) {
          if (value.split("").includes("S")) {
            // Generate new Start Symbol called $
            cfg["$"] = ["S"];
            return;
          }
        }
      };

      const removeEpsilon = (cfg) => {
        // Step 2. Eliminate null, unit and useless productions.

        // TODO: 1. null productions
        do {
          const whoHasEpsion = (cfg) => {
            for (let [key, arr] of Object.entries(cfg)) {
              for (let string of arr) {
                if (string.includes("ε") && string.length > 1) {
                  console.log(
                    `weird production lhs ${key} -> rhs ${string}, epsilon should not be placed next to other characters`
                  );
                }
                if (string === "ε") {
                  return key;
                }
              }
            }
            return null;
          };

          // debugger;
          const hasEpsilon = whoHasEpsion(cfg);
          if (!hasEpsilon) return;
          // console.log(`hasEpsilon is ${hasEpsilon}`);

          // on cfg replace rules with epsilon
          for (let [key, arr] of Object.entries(cfg)) {
            for (let str of arr) {
              if (str.includes(hasEpsilon)) {
                const toAdd = str.replace(hasEpsilon, "");
                if (str.length === 1) {
                  // A -> C ; C is hasEpsilon; then the rule A-> C --> A -> epsilon
                  arr.push("ε");
                } else {
                  if (!arr.includes(toAdd)) arr.push(toAdd);
                }
              }
            }
          }

          // Remove that epsilon from has epsilon
          cfg[hasEpsilon] = cfg[hasEpsilon].filter((str) => str !== "ε");
        } while (true);
      };

      const removeUnit = (cfg) => {
        // TODO: 2. unit productions

        const addToKey = (cfg, key, toAdd) => {
          const arr = cfg[key] || [];
          arr.push(toAdd);
          cfg[key] = arr;
        };

        const Guf = {};
        const needWorkProductions = []; //array of Maps [ {'S'->'A'} , {'S'->'B'} ]
        // take only non unit rules; unit rules being A -> B vairable to variable

        for (let [key, arr] of Object.entries(cfg)) {
          for (let str of arr) {
            if (
              str.length === 1 &&
              str.toUpperCase() === str &&
              !isNumber(str)
            ) {
              // Leave it in cfg
              // needWorkProductions.set(key, str);
              const mapSet = new Map();
              mapSet.set(key, str);
              needWorkProductions.push(mapSet);
            } else {
              if (Guf[key]?.includes(str)) continue;
              addToKey(Guf, key, str);

              // remove it from cfg
              // cfg[key] = cfg[key].filter((s) => s !== str);
            }
          }
        }

        const terminalCache = new Map();

        const getTerminals = (variable) => {
          if (terminalCache.has(variable)) {
            return terminalCache.get(variable);
          }

          const done = [];
          const foundTerminals = []; //should be a set, but no problem since duplicates never insered twice

          const recurse = (variable) => {
            const todoVariables = [];

            console.log("variable is ", variable);
            for (let str of cfg[variable]) {
              if (
                str.length === 1 &&
                str.toUpperCase() === str &&
                !isNumber(str)
              ) {
                if (!done.includes(str)) todoVariables.push(str);
              } else {
                // Its a terminal, not a variable
                foundTerminals.push(str);
              }
            }

            done.push(variable);

            todoVariables.forEach((v) => {
              recurse(v);
            });
          };

          recurse(variable);
          terminalCache.set(variable, foundTerminals);

          // console.log("temrinal cach is ", terminalCache);
          return foundTerminals;
        };

        console.log("need Work are ", needWorkProductions);
        for (let map of needWorkProductions) {
          for (let [key, variable] of map.entries()) {
            const terminals = getTerminals(variable);
            for (let terminal of terminals) {
              // if not already there
              if (Guf[key]?.includes(terminal)) continue;
              addToKey(Guf, key, terminal);
            }
          }
        }

        // log(cfg, "cfg is");
        // log(Guf, "Guf is");

        // JS is weird stackoverflow.com/a/3638034/6243753

        // Basically set cfg to Guf
        for (let key of Object.keys(cfg)) delete cfg[key];
        for (let key of Object.keys(Guf)) cfg[key] = Guf[key];
      };

      const terminalToNewVariable = (cfg) => {
        // terminal that is not on the form not _ -> t
        // _ -> aABC
        // _ -> baa

        const terminalToVarAssign = new Map();
        for (let [key, arr] of Object.entries(cfg)) {
          for (let [index, str] of arr.entries()) {
            if (str.length !== 1) {
              // _ -> aABC
              const terminals = str
                .split("")
                .filter((c) => c.toLowerCase() === c);

              for (let terminal of terminals) {
                if (terminalToVarAssign.has(terminal)) {
                  const knownVarable = terminalToVarAssign.get(terminal);
                  cfg[key][index] = cfg[key][index].replace(
                    terminal,
                    knownVarable
                  );
                } else {
                  const newVariable = getUniqueAlpha(cfg);
                  cfg[key][index] = cfg[key][index].replace(
                    terminal,
                    newVariable
                  );
                  terminalToVarAssign.set(terminal, newVariable);
                }
                // console.log(terminalToVarAssign);
              }
            }
          }
        }

        // Adding new Rules to corresponed to terminalToVarAssign
        for (let [terminal, variable] of terminalToVarAssign.entries()) {
          cfg[variable] = [terminal];
        }
      };

      const eliminateMoreThanTwo = (cfg) => {
        for (let [key, arr] of Object.entries(cfg)) {
          for (let [index, str] of arr.entries()) {
            while (cfg[key][index].length > 2) {
              const str = cfg[key][index];

              // console.log("elimMorethanTwo, ", str);

              if (str.toLowerCase() === str)
                throw new Error(
                  "Expected only Variables to be of length more than 2, not also terminals"
                );

              const newVariable = getUniqueAlpha(cfg);

              const took = str.slice(0, 2); // took the first two Variables
              const left = str.slice(2);

              cfg[key][index] = newVariable + left;
              cfg[newVariable] = [took];
            }
          }
        }
      };

      // TODO: 3. useless productions
      // cfg = {
      //   S: ["AB", "bB", "b", "aA", "a"],
      //   A: ["aA", "a"],
      //   B: ["bB", "b"],
      // };

      // S -> AB|[bB|b]|[aA|a]
      // A -> aA|a
      // B -> bB|b

      log(cfg, "original");
      newStartSymbol(cfg);
      log(cfg, "after new start symbol");
      removeEpsilon(cfg);
      log(cfg, "after removeEpsilon");
      // TODO: useLessProductions(cfg); is not implemented
      removeUnit(cfg);
      log(cfg, "after removeUnit");
      terminalToNewVariable(cfg); //step 3
      log(cfg, "after terminalToNewVariable");
      eliminateMoreThanTwo(cfg); //step 4
      log(cfg, "after eliminateMoreThanTwo");

      return cfg;
    };

    const CNF_cfg = CFGtoCNF(cfg); // modifies cfg

    log(CNF_cfg, "Final CFG after CNF");

    // const table = this.cykAlgo("aca", CNF_cfg);
    const table = this.cykAlgo(targetString, cfg);

    for (let arr of table[table.length - 1]) {
      if (arr.includes("S")) {
        console.log("DERIVABLE");
        return true;
      }
    }

    console.log("NOT DERIVABLE");
    return false;
  }

  isContextSensitive() {
    return this.productions.some(([lhs, rhs]) => lhs.length > 1);
  }
}
