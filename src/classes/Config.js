class Config {
  constructor(inputString, cyInst, forceRender) {
    this.inputString = inputString;
    this.cyinst = cyInst;
    this.forceRender = forceRender;

    this.strRem = inputString;
    this.strDone = "";
    this.winstate = undefined; // 0 lost no other options, 1 won

    this.curNode = this.#getInitalNode();
    this.movedEdge = undefined;

    this.strCurState = this.curNode.data("id");
  }
  startSimulation() {}

  tick() {
    // if winstate is determeind, deadend reached, will be filtered ouT
    // debugger;
    if (this.winstate !== undefined) return undefined;

    // loop over edges, if matches string, add to done
    // console.log(node);
    const outEdges = this.curNode.outgoers("edge");
    const possiableEdges = outEdges.filter(
      (edge) => edge.data("label") === this.nextSymbol() //|| edge.data("label") === "ε"
    );
    // TODO: step with closure
    const addClosure = (configs) => {
      // for the next configs, search closure to be added on to them, this is like two steps because of closure
      // a -> b - k , you are at k as well
      return configs.flatMap((config) => {
        let discovered = [config];

        const findValidClosure = (config) =>
          config.curNode
            .outgoers("edge")
            .filter((edge) => edge.data("label") === "ε")
            .map((edge) => {
              const nnConfig = new Config(
                config.inputString,
                config.cyinst,
                config.forceRender
              );
              nnConfig.curNode = edge.target();
              nnConfig.movedEdge = edge;
              nnConfig.strDone = config.strDone;
              nnConfig.strRem = config.strRem;
              nnConfig.winstate = config.winstate;

              nnConfig.curNode.addClass("highlighted");
              nnConfig.movedEdge?.addClass("highlighted");

              nnConfig.strCurState = nnConfig.curNode.data("id");
              console.log("new config", nnConfig);
              return nnConfig;
            })
            .filter(
              (config) =>
                discovered.filter((d) => d.curNode === config.curNode)
                  .length === 0
            );

        for (let i = 0; ; i++) {
          const config = discovered[i];
          if (!config) break;
          const configs = findValidClosure(config);
          discovered.push(...configs);
        }

        // REF: closure
        // remove the inital node, since its added by the next config anyway todo this needs to be refactored
        // another problem is that creation of this node will highlight it
        discovered = discovered.filter((c) => c.curNode !== config.curNode);
        console.log("discovered", discovered);

        return discovered;
        // const possiableEdges = config.curNode
        //   .outgoers("edge")
        //   .filter((edge) => edge.data("label") === "ε");
        // return possiableEdges.map((edge) => {
        //   const nnConfig = new Config(
        //     this.inputString,
        //     this.cyinst,
        //     this.forceRender
        //   );
        //   nnConfig.curNode = edge.target();
        //   nnConfig.movedEdge = edge;
        //   nnConfig.strDone = config.strDone;
        //   nnConfig.strRem = config.strRem;
        //   nnConfig.winstate = config.winstate;

        //   nnConfig.curNode.addClass("highlighted");
        //   nnConfig.movedEdge?.addClass("highlighted");

        //   nnConfig.strCurState = nnConfig.curNode.data("id");
        //   return nnConfig;
        // });
      });
    };

    // for each possiable edge create a config
    let newConfigs = possiableEdges.map((edge) => {
      const nextConfig = new Config(
        this.inputString,
        this.cyinst,
        this.forceRender
      );
      nextConfig.curNode = this.curNode;
      nextConfig.movedEdge = edge;
      nextConfig.strDone = this.strDone;
      nextConfig.strRem = this.strRem;
      nextConfig.winstate = this.winstate;

      // Advance each config to next node
      const consueValue = edge.data("label");
      if (consueValue === "ε") {
        // do nothing, you can't consume an epsilon
      } else {
        nextConfig.read(nextConfig.nextSymbol());
      }

      nextConfig.curNode = edge.target();

      nextConfig.curNode.addClass("highlighted");
      nextConfig.movedEdge?.addClass("highlighted");

      nextConfig.strCurState = nextConfig.curNode.data("id");
      return nextConfig;
    });

    newConfigs = newConfigs.concat(addClosure(newConfigs));
    // debugger;

    console.log("next configs", newConfigs);

    // all input consumed
    if (this.strRem.length === 0) {
      if (!possiableEdges.length) {
        if (this.curNode.data("final")) {
          this.winstate = 1;
          console.log(this.winstate);
        } else {
          this.winstate = 0;
          console.log(this.winstate);
        }
      }
      // Must be an epsilon
      // do nothing, the new config will move it them
    } else {
      if (!newConfigs.length) {
        // if no configs out of me, then deadend
        this.winstate = 0;
      }
    }

    this.forceRender();

    if (this.winstate !== undefined) {
      // reached deadend
      console.log("[SIM] Simulation " + (this.winstate ? "won" : "lost"));
      return this;
    }

    return newConfigs;
  }

  #getInitalNode() {
    const initalNode = this.cyinst.$("node[?inital]")[0];

    if (!initalNode) {
      console.log("[SIM] Error No inital Node exiting");
      return;
    }
    return initalNode;
  }

  nextSymbol() {
    return this.strRem[0];
  }
  accepts(symbol) {
    return this.nextSymbol() === symbol;
  }
  read(symbol) {
    this.strDone += symbol;
    this.strRem = this.strRem.slice(1);
    // if (this.strRem.length === 0) {
    //   this.winstate = 1;
    // }
  }
}
export default Config;
