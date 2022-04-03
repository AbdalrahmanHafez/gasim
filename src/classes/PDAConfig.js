export default class PDAConfig {
  constructor(stateId, inputString) {
    this.inputString = inputString;
    this.stateId = stateId;

    this.stack = ["Z"];
    this.strDone = "";
    this.strRem = inputString;
    this.winstate = undefined;
  }
  get nextSymbol() {
    return this.strRem[0];
  }
  get stackTop() {
    return this.stack[this.stack.length - 1];
  }

  canConsume(sym) {
    return this.strRem[0] === sym || "ε" === sym;
  }
  consume() {
    this.strDone += this.strRem[0];
    this.strRem = this.strRem.slice(1);
  }

  copy() {
    const newConfig = new PDAConfig(this.stateId, this.inputString);
    newConfig.strDone = this.strDone;
    newConfig.strRem = this.strRem;
    newConfig.winstate = this.winstate;
    newConfig.stack = [...this.stack];
    return newConfig;
  }
}
