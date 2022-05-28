import {
  createHeadlessCy,
  getFinalNodes,
  getInitalNode,
  verifyAtLeastFinalState,
  verifyInitalStateExists,
  verifyOnlyOneFinalState,
} from "../../utils";
import axios from "axios";
import { GRModel } from "../GR";
import { baseurl } from "../../Helpers/Constatns";

class Production {
  constructor(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
    if (lhs === null) this.lhs = "";
    if (rhs === null) this.rhs = "";
  }
}

export default class PDAtoGR {
  constructor(PDAModel) {
    this.PDAModel = PDAModel;
    this.cy = null;

    this.MAP = new Map();
    this.UNIQUE_ID = 0;

    this.resultGRModel = null;
  }

  get exportResult() {
    return this.resultGRModel;
  }

  checkValid() {
    /** Rules
      must pop 1 push 0 or 2
		  transition to final must pop only Z
		  can only be only one final state
		
        Errors: might not be able to represent it uniqly
     */
    // TODO:
    // Graph validity checks

    const cy = createHeadlessCy(this.PDAModel.elements);

    if (!verifyInitalStateExists(cy) || !verifyOnlyOneFinalState(cy))
      return false;

    // must pop 1 push 0 or 2
    for (let edge of cy.edges()) {
      const { symbol, pop, push } = edge.data("labelData");
      //   TODO: make PDAlabelData epsilon to be an empty string
      if (
        pop.length === 1 &&
        pop !== "ε" &&
        (push === "ε" || push.length === 0 || push.length === 2)
      ) {
        if (edge.target().data("final")) {
          // transition to final must pop only Z
          if (pop !== "Z" && symbol === "ε" && push === "ε") {
            alert("Transition to final state must pop only Z");
            return false;
          }
        }
      } else {
        alert("Graph Transitions must pop 1 character, push 0 or 2 characters");
        return false;
      }
    }

    return true;
  }

  f(edgeLabelData) {
    let { symbol, pop, push } = edgeLabelData;
    symbol = symbol === "ε" ? "" : symbol;
    pop = pop === "ε" ? "" : pop;
    push = push.replace("ε", "");

    return { symbol, pop, push };
  }

  #isPushLambdaTransition(transition) {
    const toPush = this.f(transition.data("labelData")).push;
    if (toPush.length !== 0) return false;
    /*
     * String input = trans.getInputToRead(); if(input.length() != 1) return
     * false;
     */
    const toPop = this.f(transition.data("labelData")).pop;
    if (toPop.length !== 1) return false;
    return true;
  }

  #isPushTwoTransition(transition) {
    const toPush = this.f(transition.data("labelData")).push;
    if (toPush.length !== 2) return false;
    /*
     * String input = trans.getInputToRead(); if(input.length() != 1) return
     * false;
     */
    const toPop = this.f(transition.data("labelData")).pop;
    if (toPop.length !== 1) return false;
    return true;
  }

  #getUniqueVariable() {
    const ch = [];
    ch[0] = String.fromCharCode("A".charCodeAt(0) + this.UNIQUE_ID);
    this.UNIQUE_ID++;
    if ("A".charCodeAt(0) + this.UNIQUE_ID === "S".charCodeAt(0))
      this.UNIQUE_ID++;
    return ch.join("");
  }

  #isStartSymbol(variable) {
    // State startState = automaton.getInitialState();
    // State[] finalStates = automaton.getFinalStates();
    const startState = getInitalNode(this.cy);
    const finalStates = getFinalNodes(this.cy);

    if (finalStates.length > 1) {
      // System.err.println("MORE THAN ONE FINAL STATE");
      return false;
    }

    const finalState = finalStates[0];
    // const startSymbol = LEFT_PAREN.concat(startState.getName().concat( BOTTOM_OF_STACK .concat(finalState.getName().concat(RIGHT_PAREN))));
    const startSymbol =
      "(" + startState.data("name") + "Z" + finalState.data("name") + ")";

    if (variable === startSymbol) return true;
    return false;
  }

  #getProductionsForPushLambdaTransition(transition) {
    const list = [];
    const fromState = transition.source().data("name");
    const toState = transition.target().data("name");

    const toPop = this.f(transition.data("labelData")).pop;
    const toRead = this.f(transition.data("labelData")).symbol;

    // const lhs = LEFT_PAREN.concat(fromState.concat(toPop.concat(toState .concat(RIGHT_PAREN))));
    const lhs = "(" + fromState + toPop + toState + ")";

    if (this.MAP.get(lhs) === undefined) {
      if (this.#isStartSymbol(lhs)) this.MAP.set(lhs, "S");
      else this.MAP.set(lhs, this.#getUniqueVariable());
    }

    const rhs = toRead;

    const production = new Production(lhs, rhs);
    list.push(production);
    return list;
  }

  #getProductionsForPushTwoTransition(transition) {
    const list = [];
    const fromState = transition.source().data("name");
    const toState = transition.target().data("name");
    // PDATransition trans = (PDATransition) transition;
    const toPop = this.f(transition.data("labelData")).pop;
    const toRead = this.f(transition.data("labelData")).symbol;
    const toPush = this.f(transition.data("labelData")).push;
    const toPushOne = toPush.substring(0, 1);
    const toPushTwo = toPush.substring(1);

    const states = this.cy.nodes();
    for (let k = 0; k < states.length; k++) {
      const state = states[k].data("name");
      // const lhs = LEFT_PAREN.concat(fromState.concat(toPop.concat(state .concat(RIGHT_PAREN))));
      const lhs = "(" + fromState + toPop + state + ")";

      for (let j = 0; j < states.length; j++) {
        const lstate = states[j].data("name");
        // const variable1 = LEFT_PAREN.concat(toState.concat(toPushOne .concat(lstate.concat(RIGHT_PAREN))));
        // const variable2 = LEFT_PAREN.concat(lstate.concat(toPushTwo .concat(state.concat(RIGHT_PAREN))));
        const variable1 = "(" + toState + toPushOne + lstate + ")";
        const variable2 = "(" + lstate + toPushTwo + state + ")";

        /** Map to unique variables. */
        if (this.MAP.get(lhs) === undefined) {
          if (this.#isStartSymbol(lhs)) this.MAP.set(lhs, "S");
          else this.MAP.set(lhs, this.#getUniqueVariable());
        }
        if (this.MAP.get(variable1) === undefined) {
          if (this.#isStartSymbol(variable1)) this.MAP.set(variable1, "S");
          else this.MAP.set(variable1, this.#getUniqueVariable());
        }
        if (this.MAP.get(variable2) === undefined) {
          if (this.#isStartSymbol(variable2)) this.MAP.set(variable2, "S");
          else this.MAP.set(variable2, this.#getUniqueVariable());
        }

        // const rhs = toRead.concat(variable1.concat(variable2));
        const rhs = toRead + variable1 + variable2;

        const p = new Production(lhs, rhs);
        list.push(p);
      }
    }
    return list;
  }

  #createProductionsForTransition(transition) {
    const list = [];
    // if (this.#isPushLambdaTransition(transition)) {
    //   list.addAll(getProductionsForPushLambdaTransition(transition));
    // } else if (this.#isPushTwoTransition(transition)) {
    //   list.addAll(getProductionsForPushTwoTransition(transition));
    // }
    // console.log("transition", transition.data("label"));

    if (this.#isPushLambdaTransition(transition)) {
      this.#getProductionsForPushLambdaTransition(transition).forEach(
        (production) => list.push(production)
      );
    } else if (this.#isPushTwoTransition(transition)) {
      this.#getProductionsForPushTwoTransition(transition).forEach(
        (production) => list.push(production)
      );
    }

    // console.log(list);

    return list;
  }

  #purgeProductionsHelper(lhs, productions, valid, validProductions) {
    let variables;
    let rhs;
    for (let i = 0; i < productions.length; i++)
      if (productions[i].lhs === lhs && validProductions[i] === 0) {
        validProductions[i] = 1;
        variables = [];
        rhs = productions[i].rhs;
        while (rhs.indexOf("(") > -1) {
          variables.push(rhs.substring(rhs.indexOf("("), rhs.indexOf(")") + 1));
          if (rhs.indexOf(")") !== rhs.length - 1)
            rhs = rhs.substring(rhs.indexOf(")") + 1);
          else rhs = "";
        }
        for (let j = 0; j < variables.length; j++) {
          if (validProductions[i] === 1 && !valid.has(variables[j]))
            validProductions[i] = -1;
        }
        if (validProductions[i] === 1) {
          validProductions[i] = 2;
          for (let j = 0; j < variables.length; j++)
            this.#purgeProductionsHelper(
              variables[j],
              productions,
              valid,
              validProductions
            );
        }
      }
  }

  #purgeProductions(productions) {
    const valid = new Set();
    let variables = [];
    let invalid = [];
    let updated = false;
    const validProductions = new Array(productions.length).fill(0);

    for (let i = 0; i < productions.length; i++) validProductions[i] = 0;

    //After initializing variables, add all variables that can eventually end in terminals
    //to a stack.
    do {
      updated = false;
      for (let i = 0; i < validProductions.length; i++) {
        variables = [];
        invalid = [];
        let rhs = productions[i].rhs;
        while (rhs.indexOf("(") > -1) {
          variables.push(rhs.substring(rhs.indexOf("("), rhs.indexOf(")") + 1));
          if (rhs.indexOf(")") !== rhs.length - 1)
            rhs = rhs.substring(rhs.indexOf(")") + 1);
          else rhs = "";
        }

        while (variables.length > 0)
          if (!valid.has(variables[variables.length - 1]))
            invalid.push(variables.pop());
          else variables.pop();
        if (invalid.length === 0 && !valid.has(productions[i].lhs)) {
          updated = true;
          valid.add(productions[i].lhs);
        }
      }
    } while (updated);

    //Then, trace a path from the initial variable to all terminals that it can reach.
    // const initVar = LEFT_PAREN + automaton.getInitialState().getName() + BOTTOM_OF_STACK + automaton.getFinalStates()[0].getName() + RIGHT_PAREN;
    const initVar =
      "(" +
      getInitalNode(this.cy).data("name") +
      "Z" +
      getFinalNodes(this.cy)[0].data("name") +
      ")";
    this.#purgeProductionsHelper(initVar, productions, valid, validProductions);

    //Next, delete all superfluous rows and make note of those capital-letter variable
    //assignments that are freed up in a new map.
    const newMap = new Map();
    const freeValues = new Set();

    let key;
    for (let i = 0; i < 26; i++)
      freeValues.add(String.fromCharCode("A".charCodeAt(0) + i));
    // freeValues.add("" + (char)('A' + i));
    for (let i = validProductions.length - 1; i >= 0; i--)
      if (validProductions[i] < 2)
        // model.deleteRow(i);
        productions.splice(i, 1);
      else {
        key = productions[i].lhs;
        newMap.set(key, this.MAP.get(key));

        // if (((String)MAP.get(key)).charAt(0) <= 'Z')
        // 	freeValues.remove((String)MAP.get(key));

        // console.log("map content", this.MAP);
        if (this.MAP.get(key).charCodeAt(0) <= "Z".charCodeAt(0))
          freeValues.delete(this.MAP.get(key));
      }

    //Finally, assign the new map to the old map, and assign one-letter variables to
    //any variables that need one.
    this.MAP = newMap;

    const freeIter = freeValues.values();
    const mapIter = newMap.keys();

    // while (mapIter.hasNext()) {
    // 	key = (String) mapIter.next();
    // 	if (((String)MAP.get(key)).charAt(0) > 'Z')
    // 		MAP.put(key, (String)freeIter.next());
    // }

    for (let [key, value] of newMap.entries()) {
      // console.log("key is ", key);
      if (this.MAP.get(key).charCodeAt(0) > "Z".charCodeAt(0))
        this.MAP.set(key, freeIter.next().value);
    }
  }

  #numberVariables() {
    return this.MAP.size;
  }

  #getSimplifiedProduction(production) {
    let lhs = this.MAP.get(production.lhs);
    let rhs = production.rhs;
    let leftIndex;
    let rightIndex; // Position of left and right parentheses.
    let newRhs = "";
    while (
      (leftIndex = rhs.indexOf("(")) !== -1 &&
      (rightIndex = rhs.indexOf(")")) !== -1
    ) {
      newRhs += rhs.substring(0, leftIndex);
      const variable = rhs.substring(leftIndex, rightIndex + 1);
      newRhs += this.MAP.get(variable);
      rhs = rhs.substring(rightIndex + 1);
    }
    newRhs += rhs;
    const p = new Production(lhs, newRhs);
    return p;
  }

  convert(setDisplayedGRModel) {
    console.log("PDAtoGrammar clicked");
    const cy = createHeadlessCy(this.PDAModel.elements);
    this.cy = cy;

    console.log("cy elements", cy.json());

    const list = [];
    const transitions = cy.edges();
    for (let transition of transitions) {
      this.#createProductionsForTransition(transition).forEach((elm) =>
        list.push(elm)
      );
    }

    console.log(list);
    console.log("map contents", this.MAP);

    // list.forEach((item) => {
    //   console.log(item);
    // });

    // Step 2

    const oldNumProductions = list.length;

    this.#purgeProductions(list);

    console.log(list);

    if (oldNumProductions !== list.length && this.#numberVariables() > 26)
      throw new Error(
        "Your list of rules has been trimmed, but there are still more variables than can be uniquely represented"
      );
    else if (this.#numberVariables() > 26)
      throw new Error(
        "There are more variables than can be uniquely represented."
      );

    const grammar = [];

    for (let i = 0; i < list.length; i++) {
      let production = list[i];
      if (production === undefined) continue;
      production = this.#getSimplifiedProduction(production);
      grammar.push(production);
    }

    console.log(grammar);

    const newGrammar = new GRModel(grammar.map((prod) => [prod.lhs, prod.rhs]));
    this.resultGRModel = newGrammar;
    setDisplayedGRModel(newGrammar);

    return this.resultGRModel;
  }
}
