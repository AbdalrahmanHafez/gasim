import Config from "./Config";
import PDAConfig from "./PDAConfig";
import {
  getInitalNode,
  getNodeClosure,
  getNodeFromId,
} from "../Helpers/hlpGraph";

export default class Simulation {
  constructor(ui, inputString, steppingStrategy) {
    if (this.constructor == Simulation) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this.ui = ui;
    this.inputString = inputString;
    this.cy = this.ui.cy;
    this.initalNode = getInitalNode(this.cy);
    // TODO: Dynamic sim
    this.configs = [new PDAConfig(this.initalNode.id(), inputString)];
    // this.configs = [new Config(this.initalNode.id(), inputString)];

    this.steppingStrategy = steppingStrategy;
  }

  getNextConfigs(config) {
    throw new Error("Method 'getNextConfig()' must be implemented.");
  }

  getConfigs() {
    return this.configs;
  }

  actionStepAll() {
    this.configs = this.configs.flatMap((config) =>
      this.getNextConfigs(config)
    );
    // console.log("NEW CONFIGS AFTER STEP ALL", this.configs);
  }
}
