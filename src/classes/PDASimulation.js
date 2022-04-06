import Simulation from "./Simulation";
import PDAConfig from "./PDAConfig";
import {
  getInitalNode,
  getNodeClosure,
  getNodeFromId,
  parsePDAEdgeLabel,
} from "../Helpers/hlpGraph";

import steppingStrategy from "../enums/steppingStrategy";

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
        const lbl = parsePDAEdgeLabel(edge.data("label"));
        return lbl.symbol === "ε" && lbl.push === "ε" && lbl.pop === "ε";
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
  constructor(ui, inputString, stepStart) {
    super(ui, inputString, stepStart);

    this.configs = [new PDAConfig(this.initalNode.id(), inputString)];

    // FIXME: getNodeClosure
    if (stepStart === steppingStrategy.STEP_WITH_CLOSURE) {
      this.configs.push(
        ...getPDANodeClosure(this.initalNode).map(
          (node) => new PDAConfig(node.id(), inputString)
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
    let newConfigs = [];
    node.outgoers("edge").forEach((edge) => {
      const lbl = parsePDAEdgeLabel(edge.data("label"));

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
      //  input consumption and stack modification
      if (lbl.symbol !== "ε") nodeConfig.consume();
      if (lbl.pop !== "ε") nodeConfig.stack.pop();
      if (lbl.push !== "ε") nodeConfig.stack.push(lbl.push);

      let nodeClosureConfigs = nodeClosure.map((node) => {
        const newConfig = nodeConfig.copy();
        newConfig.stateId = node.id();
        return newConfig;
      });

      newConfigs.push(...nodeClosureConfigs.concat(nodeConfig));
    });

    console.log("newConfigs", newConfigs);
    console.log("==============================");

    return newConfigs;
  }
  #getNextConfigsStepByState(config) {
    const node = getNodeFromId(this.cy, config.stateId);

    const newConfigs = [];
    node.outgoers("edge").forEach((edge) => {
      const lbl = parsePDAEdgeLabel(edge.data("label"));
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
      return config;
    }
    // if no more remaining string, and there are more options(epsilons),
    // if if cur node is winning show that, if not continue to next epsilon

    // limitation: that may create duplicates in the configs
    if (config.strRem.length === 0) {
      config.winstate = this.setWinState(node);
      if (config.winstate === 1) return [config, ...nextConfigs];
      else return nextConfigs;
    }

    return nextConfigs;
  }
}
