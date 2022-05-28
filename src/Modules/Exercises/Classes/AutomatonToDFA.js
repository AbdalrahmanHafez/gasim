import { assert } from "../../../utils";
import FSAModel from "../../FSA/FSAModel";
import REModel from "../../RE/REModel";
import NFAtoDFA from "../../Conversion/NFAtoDFA.js";
import REtoNFA from "../../Conversion/REtoNFA.js";
import {
  addElementsToCy,
  injectEmptyCy,
  getNodeClosure,
  createHeadlessCy,
} from "../../../utils";
import DFAEquality from "./DFAEquality";

class AutomatonToDFA {
  constructor() {}

  convertFSA(fsa) {
    const dstcy = createHeadlessCy();

    const converter = new NFAtoDFA();
    converter.FSAModel = fsa;

    try {
      converter.convert(dstcy);
    } catch (error) {
      // noInitalNode
      alert(error);
    }

    return new FSAModel(dstcy.json().elements);
  }

  convertRE(remodel) {
    const dstcy = createHeadlessCy();

    try {
      new REtoNFA(remodel).convert(dstcy);
    } catch (error) {
      alert(error);
    }

    return this.convertFSA(new FSAModel(dstcy.json().elements));
  }

  convert(automaton) {
    // NFA to DFA
    // DFA to NFA 	?
    // NFA to RE
    // RE 	to NFA
    // {NFA, RE} => DFA

    if (automaton instanceof FSAModel) {
      return this.convertFSA(automaton);
    }
    if (automaton instanceof REModel) {
      return this.convertRE(automaton);
    }
  }
}

export default AutomatonToDFA;
