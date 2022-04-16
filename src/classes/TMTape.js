import TMConfig from "./TMConfig";

export default class TMTape {
  constructor(input) {
    this.input = input;
    this.head = 0;
    this.elements = {};
    [...input].forEach((elm, idx) => this.#putElm(elm, idx));
  }

  #putElm(elm, position) {
    this.elements[position] = elm;
  }

  get toString() {
    return Object.values(this.elements).join("");
  }

  canConsume(sym) {
    const headChar = this.elements[this.head];
    const matchesTape = headChar === sym;

    if (headChar === undefined && sym === TMConfig.empty)
      // the head is pointing to a non element /
      return true;

    return matchesTape;
  }

  consume(replacement, movement) {
    if (replacement === TMConfig.empty) {
      delete this.elements[this.head];
    } else {
      this.elements[this.head] = replacement;
    }

    this.head += movement;
  }

  copy() {
    const newTape = new TMTape(this.input);
    newTape.head = this.head;
    newTape.elements = { ...this.elements };
    return newTape;
  }
}
