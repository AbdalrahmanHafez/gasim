import Simulation from "../../classes/Simulation";
import Config from "../../classes/Config";
import PDAConfig from "../../classes/PDAConfig";

import { getInitalNode, getNodeClosure, getNodeFromId } from "../../utils";

import steppingStrategies from "../../enums/steppingStrategies";

function assert(condition, message) {
  if (!condition) {
    if (message) throw new Error(message);
    else throw new Error("Assertion failed");
  }
}

const getPDANodeClosure = (node) => {
  const closure = (node) =>
    node
      .outgoers("edge")
      .filter((edge) => {
        const lblData = edge.data("labelData");
        return (
          lblData.symbol === "ε" && lblData.push === "ε" && lblData.pop === "ε"
        );
      })
      .map((edge) => edge.target());

  const discovered = closure(node);

  for (let i = 0; ; i++) {
    const node = discovered[i];
    if (!node) break;
    closure(node).forEach((node) => {
      if (discovered.filter((d) => d.id() === node.id()).length === 0)
        discovered.push(node);
    });
  }

  return discovered;
};

export default class PDASimulation extends Simulation {
  // TODO: support multiple character pushes, pops
  constructor(cy, inputString, stepStrat) {
    super(cy, stepStrat);
    this.inputString = inputString;

    this.configs = [new PDAConfig(this.initalNode.id(), inputString)];

    // FIXME: getNodeClosure
    if (stepStrat === steppingStrategies.STEP_WITH_CLOSURE) {
      this.configs.push(
        ...getPDANodeClosure(this.initalNode).map(
          (node) => new PDAConfig(node.id(), inputString)
        )
      );
    } else if (stepStrat === steppingStrategies.STEP_BY_STATE) {
      // do nothing,
      // the inital node is already in the configs
    } else if (stepStrat === steppingStrategies.RANDOM) {
      // do nothing,
      // the inital node is already in the configs
    } else {
      throw new Error("Not implemented");
    }
  }
  #getTakenEdges_epsilon(node) {
    return node.incomers("edge").filter((edge) => {
      const lbl = edge.data("labelData");
      return lbl.symbol === "ε" && lbl.push === "ε" && lbl.pop === "ε";
    });
  }

  #getNextConfigsClosure(config) {
    const node = getNodeFromId(this.cy, config.stateId);
    // debugger;

    // console.log("getting next config closure on config ", config.stateId);
    let newConfigs = [];
    node.outgoers("edge").forEach((edge) => {
      const lbl = edge.data("labelData");

      /* 
      aae OK
      eea OK
      eee NO
      */
      if (
        !(
          config.canConsume(lbl.symbol) &&
          (config.stackTop === lbl.pop || lbl.pop === "ε") &&
          !(lbl.push === "ε" && lbl.pop === "ε" && lbl.symbol === "ε")
        )
      ) {
        return;
      }

      const node = edge.target();
      // the filter removes the same node if it is seen by closure
      const nodeClosure = getPDANodeClosure(node).filter(
        (n) => n.id() !== node.id()
      );

      const nodeConfig = config.copy();
      nodeConfig.stateId = node.id();
      nodeConfig.takenEdges = [edge];
      //  input consumption and stack modification
      if (lbl.symbol !== "ε") nodeConfig.consume();
      if (lbl.pop !== "ε") nodeConfig.stack.pop();
      if (lbl.push !== "ε") nodeConfig.stack.push(lbl.push);

      let nodeClosureConfigs = nodeClosure.map((node) => {
        const newConfig = nodeConfig.copy();
        newConfig.stateId = node.id();
        newConfig.takenEdges = this.#getTakenEdges_epsilon(node);
        return newConfig;
      });

      newConfigs.push(...nodeClosureConfigs.concat(nodeConfig));
    });

    return newConfigs;
  }
  #getNextConfigsStepByState(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    const newConfigs = [];
    node.outgoers("edge").forEach((edge) => {
      const lbl = edge.data("labelData");
      if (
        !(
          config.canConsume(lbl.symbol) &&
          (config.stackTop === lbl.pop || lbl.pop === "ε")
        )
      ) {
        return;
      }

      const node = edge.target();
      const newConfig = config.copy();
      newConfig.stateId = node.id();
      newConfig.takenEdges = [edge];

      if (lbl.symbol !== "ε") newConfig.consume();
      if (lbl.pop !== "ε") newConfig.stack.pop();
      if (lbl.push !== "ε") newConfig.stack.push(lbl.push);

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

  setWinState(node, config) {
    if (node.data("final") && config.strRem.length === 0) return 1;
    // if (node.data("final")) return 1;
    return 0;
  }

  getNextConfigs(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    if (config.winstate !== undefined) {
      // console.log("Removing configs with winstate", config.stateId);
      return [];
    }
    // if (config.strRem.length === 0 && config.inputString !== "") {
    //   config.winstate = this.setWinState(node);
    //   return config;
    // }

    let nextConfigs = [];

    switch (this.steppingStrategy) {
      case steppingStrategies.STEP_WITH_CLOSURE:
        // console.log("Stepping with closure");
        nextConfigs = this.#getNextConfigsClosure(config);
        break;
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
    // if no more possiable routes you have to choose a winning state
    if (nextConfigs.length === 0) {
      config.winstate = this.setWinState(node, config);
      config.takenEdges = [];
      return config;
    }
    // if no more remaining string, and there are more options(epsilons),
    // if if cur node is winning show that, if not continue to next epsilon

    // limitation: that may create duplicates in the configs
    if (config.strRem.length === 0) {
      config.winstate = this.setWinState(node, config);
      config.takenEdges = [];
      if (config.winstate === 1) return [config, ...nextConfigs];
      else return nextConfigs;
    }

    return nextConfigs;
  }
}
