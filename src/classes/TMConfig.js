import Config from "./Config";

// NOTE: does not extend Config

export default class TMConfig extends Config {
  constructor(stateId, tapes) {
    super(stateId, null);
    this.tapes = tapes;
  }

  static get empty() {
    return "▢";
  }

  get nextSymbol() {
    return null;
  }
  canConsume(sym) {
    return null;
  }
  consume(sym) {
    return null;
  }
  copy() {
    return null;
  }

  copyTapes() {
    return this.tapes.map((tape) => tape.copy());
  }
}
