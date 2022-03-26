class Config {
  constructor(inputString, cyInst, forceRender) {
    this.inputString = inputString;
    this.cyinst = cyInst;
    this.forceRender = forceRender;

    this.strRem = inputString;
    this.strDone = "";
    this.winstate = undefined; // 0 lost no other options, 1 won

    this.curNode = this.#getInitalNode();
    this.choosenEdge = undefined;

    this.strCurState = "";
  }
  startSimulation() {
    this.updateSimUI();
    setTimeout(() => {
      // TODO: WTF is this
      this.cyinst.resize();
      this.cyinst.fit();
    }, 500);
  }

  tick() {
    console.count("called sim tick");
    const tick = (node) => {
      // loop over edges, if matches string, add to done
      //   debugger;
      console.log(node);
      const outEdges = node.outgoers("edge");
      const choosenEdge = outEdges.filter(
        (edge) => edge.data("label") === this.nextSymbol()
      )[0];
      this.choosenEdge = choosenEdge;
      if (choosenEdge) {
        this.read(this.nextSymbol());
        this.curNode = choosenEdge.target();
        return choosenEdge.target();
      } else {
        // check that curNode is standing on a final node
        if (this.strRem.length > 0) {
          this.winstate = 0;
        } else {
          if (this.curNode.data("final")) {
            this.winstate = 1;
          } else this.winstate = 0;
        }
        return undefined;
      }
    };

    tick(this.curNode);
    this.updateSimUI();
    console.log(this);

    const winstate = this.winstate;
    if (winstate !== undefined) {
      console.log("[SIM] Simulation " + (winstate ? "won" : "lost"));
      return;
    }
  }
  updateSimUI() {
    // highlight graph
    // TODO: fix cyinstances, make generic
    this.cyinst.nodes().classes([]);
    this.curNode.addClass("highlighted");
    this.cyinst.edges().classes([]);
    this.choosenEdge?.addClass("highlighted");

    this.strCurState = this.curNode.data("id");

    // this.setTest((test) => ({
    //   ...test,
    //   curState: strCurState,
    //   strDone: this.simConfig.strDone,
    //   strRem: this.simConfig.strRem,
    //   winstate: winstate,
    // }));

    this.cyinst.fit();
    this.forceRender();
  }

  #getInitalNode() {
    console.log(this.cyinst);
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
