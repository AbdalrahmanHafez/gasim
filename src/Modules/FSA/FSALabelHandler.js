import LabelHandler from "../../classes/LabelHandler";
import { str_substitute_empty } from "../../Helpers/GraphLabel.js";
import { IMaskInput, IMask, IMaskMixin } from "react-imask";
import { symbols } from "../../Helpers/Constatns";

export default class FSALabelHandler extends LabelHandler {
  getInputElements(edge) {
    const inputEles = [];
    const labelData = edge.data("labelData");

    if (labelData === undefined) {
      //   This means that the edge is a new edge

      var newMask = this.createIMask();
      inputEles.push(newMask.el.input);

      return inputEles;
    }
    // not a new Edge , renaming an edge

    const label = labelData;

    var renameMask = this.createIMask();

    renameMask.value = label;
    inputEles.push(renameMask.el.input);

    return inputEles;
  }

  saveInputData() {
    const values = this.getInputValuesFromPopper();
    let label = values[0];
    label = str_substitute_empty(label, "ε");

    this.inputPopper.edge.data({ label, labelData: label });
    return true;
  }

  createIMask() {
    const maskOptions = { mask: "*", placeholderChar: "_" };
    // const maskOptions = { mask: "*{,}*{→}*", placeholderChar: "_" };

    var mask = IMask(document.createElement("input"), maskOptions);
    mask.on("accept", () => {
      const rawValue = mask.masked.rawInputValue;
      //   console.log(rawValue);
      mask.value = rawValue.split(" ").join(symbols.epsilon);
    });

    return mask;
  }
}
