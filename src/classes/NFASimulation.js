import Simulation from "./Simulation";
import Config from "./Config";
import {
  getInitalNode,
  getNodeClosure,
  getNodeFromId,
} from "../Helpers/hlpGraph";

import steppingStrategy from "../enums/steppingStrategy";

export default class NFASimulation extends Simulation {
  constructor(ui, inputString, steppingStrategy) {
    super(ui, inputString, steppingStrategy);
    this.configs.push(
      ...getNodeClosure(this.initalNode).map(
        (node) => new Config(node.id(), inputString)
      )
    );
  }

  #getNextConfigsClosure(config) {
    const node = getNodeFromId(this.cy, config.stateId);
    // debugger;
    // TODO: lift this the code of winning up to the switch statement
    if (config.winstate !== undefined) {
      console.log("Removing configs with winstate", config.stateId);
      return [];
    }
    if (config.strRem.length === 0) {
      if (node.data("final")) {
        config.winstate = 1;
      } else {
        config.winstate = 0;
      }
      return config;
    }

    console.log("getting next config closure on config ", config.stateId);
    const nextSymbolNodes = node
      .outgoers("edge")
      .filter((edge) => config.canConsume(edge.data("label")))
      .map((edge) => edge.target());

    const nnEpsilonNodes = nextSymbolNodes.flatMap((node) =>
      getNodeClosure(node)
    );

    let newNodes = [...new Set(nnEpsilonNodes.concat(nextSymbolNodes))];
    // all is consumed, because of the way the algorithms works
    let newConfigs = newNodes.map((node) => {
      const newConfig = config.copy();
      newConfig.consume();
      newConfig.stateId = node.id();
      return newConfig;
    });
    console.log("newNodes", newNodes);
    console.log("newConfigs", newConfigs);
    console.log("==============================");

    // winning Logic
    if (newConfigs.length === 0) {
      console.log("lost @ config", config.stateId);
      config.winstate = 0;
      return config;
    }

    return newConfigs;
  }
  #getNextConfigsStepByState(config) {}
  #getNextConfigsRandom(config) {}

  getNextConfigs(config) {
    switch (this.steppingStrategy) {
      case steppingStrategy.STEP_WITH_CLOSURE:
        console.log("Stepping with closure");
        return this.#getNextConfigsClosure(config);
      case steppingStrategy.STEP_BY_STATE:
        console.log("Stepping By state");
        return this.#getNextConfigsStepByState(config);
      case steppingStrategy.RANDOM:
        console.log("Stepping random");
        return this.#getNextConfigsRandom(config);
      default:
        throw new Error("invalid stepping strategy");
    }
  }
}
