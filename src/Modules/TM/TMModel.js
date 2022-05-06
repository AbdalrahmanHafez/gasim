import { assert } from "../../utils";

export default class TMModel {
  constructor(graphElements, tapesCount) {
    this.elements = graphElements;
    this.tapesCount = tapesCount;
    assert(tapesCount > 0, "Tapes count must be greater than 0");
  }
}
