import Simulation from "./Simulation";
import Config from "./Config";
import {
  getInitalNode,
  getNodeClosure,
  getNodeFromId,
} from "../Helpers/hlpGraph";

import steppingStrategy from "../enums/steppingStrategy";

export default class NFASimulation extends Simulation {
  constructor(ui, inputString, stepStart) {
    super(ui, inputString, stepStart);

    if (stepStart === steppingStrategy.STEP_WITH_CLOSURE) {
      this.configs.push(
        ...getNodeClosure(this.initalNode).map(
          (node) => new Config(node.id(), inputString)
        )
      );
    } else if (stepStart === steppingStrategy.STEP_BY_STATE) {
      // do nothing,
      // the inital node is already in the configs
    } else if (stepStart === steppingStrategy.RANDOM) {
      // do nothing,
      // the inital node is already in the configs
    } else {
      throw new Error("Not implemented");
    }
  }

  #getNextConfigsClosure(config) {
    const node = getNodeFromId(this.cy, config.stateId);
    // debugger;

    // console.log("getting next config closure on config ", config.stateId);
    const nextSymbolNodes = node
      .outgoers("edge")
      .filter((edge) => config.nextSymbol === edge.data("label"))
      .map((edge) => edge.target());

    const nnEpsilonNodes = nextSymbolNodes.flatMap((n) => getNodeClosure(n));

    let newNodes = [...new Set(nnEpsilonNodes.concat(nextSymbolNodes))];
    // console.log("newNodes", newNodes);
    // all is consumed, because of the way the algorithms works
    let newConfigs = newNodes.map((node) => {
      const newConfig = config.copy();
      newConfig.consume();
      newConfig.stateId = node.id();
      return newConfig;
    });
    // console.log("newNodes", newNodes);
    // console.log("newConfigs", newConfigs);
    // console.log("==============================");

    return newConfigs;
  }
  #getNextConfigsStepByState(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    const nextConfigs = node
      .outgoers("edge")
      .filter((edge) => config.canConsume(edge.data("label")))
      .map((edge) => {
        const node = edge.target();
        const newConfig = config.copy();
        if (edge.data("label") !== "ε") newConfig.consume();
        newConfig.stateId = node.id();
        return newConfig;
      });

    return nextConfigs;
  }
  #getNextConfigsRandom(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    const nextEdges = node
      .outgoers("edge")
      .filter((edge) => config.canConsume(edge.data("label")));

    if (nextEdges.length === 0) return [];

    const choosenEdge = nextEdges[Math.floor(Math.random() * nextEdges.length)];
    const choosenNode = choosenEdge.target();

    const newConfig = config.copy();
    if (choosenEdge.data("label") !== "ε") newConfig.consume();
    newConfig.stateId = choosenNode.id();

    return [newConfig];
  }

  getNextConfigs(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    if (config.winstate !== undefined) {
      // console.log("Removing configs with winstate", config.stateId);
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

    let nextConfigs = [];

    switch (this.steppingStrategy) {
      case steppingStrategy.STEP_WITH_CLOSURE:
        // console.log("Stepping with closure");
        nextConfigs = this.#getNextConfigsClosure(config);
        break;
      case steppingStrategy.STEP_BY_STATE:
        // console.log("Stepping By state");
        nextConfigs = this.#getNextConfigsStepByState(config);
        break;
      case steppingStrategy.RANDOM:
        // console.log("Stepping random");
        nextConfigs = this.#getNextConfigsRandom(config);
        break;
      default:
        throw new Error("invalid stepping strategy");
    }

    // winning Logic
    if (nextConfigs.length === 0) {
      // console.log("lost @ config", config.stateId);
      config.winstate = 0;
      return config;
    }
    return nextConfigs;
  }
}
