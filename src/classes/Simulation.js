export default class Simulation {
  constructor(cy) {
    this.cy = cy;
  }

  handleStartSimulation() {
    console.log("clicked start simulation");
    const inputString = prompt("Enter input string", "abcd");
    if (!inputString) return;

    const initalNode = this.cy.$("node[?inital]")[0];
    if (!initalNode) {
      console.log("[SIM] no inital exiting");
      alert("No inital node found. right click on a node to spcifiy initial");
      return;
    }
  }
}
