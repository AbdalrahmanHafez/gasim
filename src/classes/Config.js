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

    this.strCurState = "";
  }
  startSimulation() {
    setTimeout(() => {
      // TODO: WTF is this
      this.cyinst.resize();
      this.cyinst.fit();
    }, 500);
  }

  tick() {
    // if winstate is determeind, deadend reached, will be filtered ouT
    // debugger;
    if (this.winstate !== undefined) return undefined;

    // loop over edges, if matches string, add to done
    // console.log(node);
    const outEdges = this.curNode.outgoers("edge");
    const possiableEdges = outEdges.filter(
      (edge) =>
        edge.data("label") === this.nextSymbol() || edge.data("label") === "ε"
    );

    // for each possiable edge create a config
    const newConfigs = possiableEdges.map((edge) => {
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
    }

    this.forceRender();

    if (this.winstate !== undefined) {
      // reached deadend
      console.log("[SIM] Simulation " + (this.winstate ? "won" : "lost"));
      return this;
    }

    // console.log("new configs");
    // console.log(newConfigs);

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
