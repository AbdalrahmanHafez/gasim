class Sim {
  constructor(automaton, setred) {
    this.automaton = automaton;
    this.configs = [1, 2];
    this.red = false;
  }

  handleStart() {
    console.log("Sim Handle start");
  }
  handleTick() {
    console.log("Sim Tick");
    this.configs.push(this.configs.length);
    console.log(this);
    if (this.configs.length > 5) {
      //   this.setred(true);
      this.red = true;
    }
  }
}
export default Sim;
