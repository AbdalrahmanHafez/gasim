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
    super(ui, stepStart);
    this.inputString = inputString;

    this.configs = [new Config(this.initalNode.id(), inputString)];

    if (stepStart === steppingStrategy.STEP_WITH_CLOSURE) {
      this.configs.push(
        ...getNodeClosure(this.initalNode).map((node) => {
          const newConfig = new Config(node.id(), inputString);
          newConfig.takenEdges = this.#getTakenEdges_epsilon(node);
          return newConfig;
        })
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

  #getTakenEdges_epsilon(node) {
    return this.#getTakenEdges_label(node, "ε");
  }
  #getTakenEdges_label(node, label) {
    return node.incomers("edge").filter((edge) => edge.data("label") === label);
  }

  #getNextConfigsClosure(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    // console.log("getting next config closure on config ", config.stateId);
    const nextSymbolNodes = node
      .outgoers("edge")
      .filter((edge) => config.nextSymbol === edge.data("labelData"))
      .map((edge) => edge.target());

    const nnEpsilonNodes = nextSymbolNodes.flatMap((n) => getNodeClosure(n));

    let newNodes = [...new Set(nnEpsilonNodes.concat(nextSymbolNodes))];
    // console.log("newNodes", newNodes);
    // all is consumed, because of the way the algorithms works
    let newConfigs = newNodes.map((node) => {
      const newConfig = config.copy();
      newConfig.stateId = node.id();
      newConfig.consume();

      newConfig.takenEdges = nextSymbolNodes.includes(node)
        ? this.#getTakenEdges_label(node, config.nextSymbol)
        : nnEpsilonNodes.includes(node)
        ? this.#getTakenEdges_epsilon(node)
        : [];
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
      .filter((edge) => config.canConsume(edge.data("labelData")))
      .map((edge) => {
        const node = edge.target();
        const newConfig = config.copy();
        if (edge.data("labelData") !== "ε") newConfig.consume();
        newConfig.stateId = node.id();
        newConfig.takenEdges = [edge];
        return newConfig;
      });
    console.log(nextConfigs);
    return nextConfigs;
  }
  #getNextConfigsRandom(config) {
    const configs = this.#getNextConfigsStepByState(config);

    const choosenConfig = configs[Math.floor(Math.random() * configs.length)];

    if (!choosenConfig) return [];
    return [choosenConfig];
  }

  setWinState(node) {
    if (node.data("final")) return 1;
    return 0;
  }
  getNextConfigs(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    if (config.winstate !== undefined) {
      // console.log("Removing configs with winstate", config.stateId);
      return [];
    }
    // debugger;
    // if (config.strRem.length === 0 && config.inputString !== "") {
    //   config.winstate = this.setWinState(node);
    //   return config;
    // }

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
    // if no more possiable routes you have to choose a winning state
    if (nextConfigs.length === 0) {
      config.winstate = this.setWinState(node);
      config.takenEdges = [];
      return config;
    }
    // if no more remaining string, and there are more options(epsilons),
    // if if cur node is winning show that, if not continue to next epsilon

    // limitation: that may create duplicates in the configs
    if (config.strRem.length === 0) {
      config.winstate = this.setWinState(node);
      config.takenEdges = [];
      if (config.winstate === 1) return [config, ...nextConfigs];
      else return nextConfigs;
    }

    return nextConfigs;
  }
}
