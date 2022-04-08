export default class Config {
  constructor(stateId, inputString) {
    this.inputString = inputString;
    this.stateId = stateId;

    this.strDone = "";
    this.strRem = inputString;
    this.winstate = undefined;

    this.takenEdges = undefined; // used for highlighting
  }
  get nextSymbol() {
    return this.strRem[0];
  }
  canConsume(sym) {
    return this.strRem[0] === sym || "ε" === sym;
  }
  consume() {
    this.strDone += this.strRem[0];
    this.strRem = this.strRem.slice(1);
  }

  copy() {
    const newConfig = new (Object.getPrototypeOf(this).constructor)(
      this.stateId,
      this.inputString
    );
    // const newConfig = new Config(this.stateId, this.inputString);
    newConfig.strDone = this.strDone;
    newConfig.strRem = this.strRem;
    newConfig.winstate = this.winstate;
    return newConfig;
  }
}
