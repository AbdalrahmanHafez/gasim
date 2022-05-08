import {
  createHeadlessCy,
  verifyAtLeastFinalState,
  verifyInitalStateExists,
} from "../../utils";
import axios from "axios";

export default class NFAtoRE {
  constructor(FSAModel) {
    this.FSAModel = FSAModel;
  }

  async convert() {
    // shourld return re exp
    console.log("Clicked converting button, FSA to RE");

    const cy = createHeadlessCy(this.FSAModel.elements);

    if (!verifyInitalStateExists(cy) || !verifyAtLeastFinalState(cy)) return;

    const nodes = cy.nodes().map((n) => ({
      id: n.data("id"),
      inital: n.data("inital"),
      final: n.data("final"),
    }));
    const edges = cy.edges().map((e) => ({
      source: e.data("source"),
      target: e.data("target"),
      label: e.data("label") === "ε" ? "" : e.data("label"),
    }));
    const graphData = { nodes, edges };
    const graphDataStr = JSON.stringify(graphData);
    // console.log(graphDataStr);

    try {
      const result = await axios.post(
        `http://localhost:5050/js`,
        `code=edu.duke.cs.jflap.JFLAP.FSAtoRE('${encodeURIComponent(
          graphDataStr
        )}');`
      );
      console.log("regex is ", result.data);
      return result.data;
    } catch (error) {
      alert(error);
    }

    // return "abchello";
  }
}
