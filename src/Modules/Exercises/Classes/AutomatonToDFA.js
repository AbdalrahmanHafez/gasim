import { assert } from "../../../utils";
import FSAModel from "../../FSA/FSAModel";
import NFAtoDFA from "../../Conversion/NFAtoDFA.js";
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

  convert(automaton) {
    // NFA to DFA
    // DFA to NFA 	?
    // NFA to RE
    // RE 	to NFA
    // {NFA, RE} => DFA

    if (automaton instanceof FSAModel) {
      return this.convertFSA(automaton);
    }
  }
}

export default AutomatonToDFA;
