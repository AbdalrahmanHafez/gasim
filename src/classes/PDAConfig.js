import Config from "./Config";
export default class PDAConfig extends Config {
  constructor(stateId, inputString) {
    super(stateId, inputString);

    this.stack = ["Z"];
  }

  get stackTop() {
    return this.stack[this.stack.length - 1];
  }

  copy() {
    const newConfig = super.copy();
    newConfig.stack = [...this.stack];

    // const newConfig = new PDAConfig(this.stateId, this.inputString);
    // newConfig.strDone = this.strDone;
    // newConfig.strRem = this.strRem;
    // newConfig.winstate = this.winstate;
    // newConfig.stack = [...this.stack];

    return newConfig;
  }

  static get empty() {
    return "ε";
  }
}
