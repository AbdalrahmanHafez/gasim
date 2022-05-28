import { assert } from "../../../utils";
import FSAModel from "../../FSA/FSAModel";
import NFAtoDFA from "../../Conversion/NFAtoDFA.js";
import {
  addElementsToCy,
  injectEmptyCy,
  getNodeClosure,
  createHeadlessCy,
} from "../../../utils";

class AutomatonToDFA {
  constructor() {}

  test() {
    const nfaA = new FSAModel({
      nodes: [
        {
          data: { id: "a", name: "a", inital: true, final: false },
        },
        {
          data: { id: "b", name: "b", inital: false, final: false },
        },
        {
          data: { id: "s", name: "s", inital: false, final: false },
        },
        { data: { id: "f", name: "f", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "bf", source: "b", target: "f", label: "b" } },
        { data: { id: "as", source: "a", target: "s", label: "ε" } },
        { data: { id: "sb", source: "s", target: "b", label: "ε" } },
      ],
    });
    const nfaB = new FSAModel({
      nodes: [
        {
          data: { id: "a", name: "a", inital: true, final: false },
        },
        {
          data: { id: "b", name: "b", inital: false, final: false },
        },
        { data: { id: "f", name: "f", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "bf", source: "b", target: "f", label: "b" } },
      ],
    });

    return this.convert(nfaA);
  }

  convertFSA(fsa) {
    const dstcy = createHeadlessCy(fsa.elements);

    const converter = new NFAtoDFA();
    converter.FSAModel = fsa;
    converter.convert(dstcy);

    console.log("dstcy", dstcy);

    return JSON.stringify(dstcy.json().elements);
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
