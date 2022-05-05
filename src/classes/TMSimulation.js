import Simulation from "./Simulation";
import PDAConfig from "./PDAConfig";
import { getInitalNode, getNodeClosure, getNodeFromId } from "../utils";

import steppingStrategies from "../enums/steppingStrategies";
import TMConfig from "./TMConfig";
import TMTape from "./TMTape";

function assert(condition, message) {
  if (!condition) {
    if (message) throw new Error(message);
    else throw new Error("Assertion failed");
  }
}

export default class TMSimulation extends Simulation {
  constructor(ui, inputs, steppingStrategy) {
    super(ui, steppingStrategy);
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
      const parsed = edge.data("labelData");
      if (!parsed.every((seg, idx) => config.tapes[idx].canConsume(seg.symbol)))
        return; // go to the next edge

      const newNode = edge.target();

      const newConfig = new TMConfig(newNode.id(), config.copyTapes());
      newConfig.takenEdges = [edge];

      parsed.forEach((input, idx) => {
        newConfig.tapes[idx].consume(input.replacement, input.movement);
      });

      newConfigs.push(newConfig);
    });

    return newConfigs;
  }
  #getNextConfigsRandom(config) {
    const configs = this.#getNextConfigsStepByState(config);

    const choosenConfig = configs[Math.floor(Math.random() * configs.length)];

    if (!choosenConfig) return [];
    return [choosenConfig];
  }

  getNextConfigs(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    if (config.winstate !== undefined) {
      config.takenEdges = [];
      return [];
    }

    // if you pass by a final state, you win directly, no more steps
    if (this.setWinState(node) === 1) {
      config.winstate = 1;
      return config;
    }

    let nextConfigs = [];

    switch (this.steppingStrategy) {
      case steppingStrategies.STEP_BY_STATE:
        // console.log("Stepping By state");
        nextConfigs = this.#getNextConfigsStepByState(config);
        break;
      case steppingStrategies.RANDOM:
        // console.log("Stepping random");
        nextConfigs = this.#getNextConfigsRandom(config);
        break;
      default:
        throw new Error("invalid stepping strategy");
    }

    // winning Logic
    if (nextConfigs.length === 0) {
      config.winstate = this.setWinState(node);
      config.takenEdges = [];
      return config;
    }

    return nextConfigs;
  }
}
