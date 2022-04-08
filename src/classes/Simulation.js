import Config from "./Config";
import PDAConfig from "./PDAConfig";
import {
  getInitalNode,
  getNodeClosure,
  getNodeFromId,
} from "../Helpers/hlpGraph";

export default class Simulation {
  constructor(ui, steppingStrategy) {
    if (this.constructor == Simulation) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this.ui = ui;
    this.cy = this.ui.cy;
    this.initalNode = getInitalNode(this.cy);

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
    console.log("NEW CONFIGS AFTER STEP ALL", this.configs);
  }
  // AddTakenEdgeFromConfigToConfigs(config, configs) {
  //   const cy = this.ui.cy;
  //   const nodes = configs.map((c) => getNodeFromId(cy, c.stateId));
  //   const initNode = getNodeFromId(cy, config.stateId);
  //   console.log(
  //     cy.elements().bfs({
  //       root: initNode,
  //       visit: function (v, e, u, i, depth) {
  //         const idx = nodes.indexOf(v);
  //         if (idx === -1) return;
  //         console.log(`${v?.id()} ${e?.id()} ${u?.id()} ${i} ${depth}`);
  //         if (e === undefined) {
  //           return true;
  //         }
  //         // console.log("connecting " + e.data("label"));
  //         configs[idx].takenEdge = e;
  //       },
  //       directed: true,
  //     })
  //   );
  // }
}
