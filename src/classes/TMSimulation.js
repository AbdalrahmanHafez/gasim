import Simulation from "./Simulation";
import PDAConfig from "./PDAConfig";
import { getNodeFromId, parseTMEdgeLabel } from "../Helpers/hlpGraph";
import steppingStrategy from "../enums/steppingStrategy";
import TMConfig from "./TMConfig";
import TMTape from "./TMTape";

function assert(condition, message) {
  if (!condition) {
    if (message) throw new Error(message);
    else throw new Error("Assertion failed");
  }
}

export default class TMSimulation extends Simulation {
  constructor(ui, inputs) {
    super(ui, steppingStrategy.STEP_BY_STATE);
    this.inputs = inputs;
    const initTapes = inputs.map((input) => new TMTape(input));
    this.configs = [new TMConfig(this.initalNode.id(), initTapes)];
  }

  setWinState(node) {
    if (node.data("final")) return 1;
    return 0;
  }

  #getNextConfigsStepByState(config) {
    const node = getNodeFromId(this.cy, config.stateId);
    let newConfigs = [];
    node.outgoers("edge").forEach((edge) => {
      // debugger;
      const parsed = parseTMEdgeLabel(edge.data("label"));
      if (!parsed.every((seg, idx) => config.tapes[idx].canConsume(seg.symbol)))
        return; // go to the next edge

      const newNode = edge.target();

      const newConfig = new TMConfig(newNode.id(), config.copyTapes());

      parsed.forEach((input, idx) => {
        newConfig.tapes[idx].consume(input.replacement, input.movement);
      });

      newConfigs.push(newConfig);
    });

    return newConfigs;
  }

  getNextConfigs(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    if (config.winstate !== undefined) {
      return [];
    }

    let nextConfigs = [];

    if (this.steppingStrategy !== steppingStrategy.STEP_BY_STATE)
      throw new Error("invalid stepping strategy");

    nextConfigs = this.#getNextConfigsStepByState(config);

    // winning Logic
    if (nextConfigs.length === 0) {
      config.winstate = this.setWinState(node);
      return config;
    }

    return nextConfigs;
  }
}
