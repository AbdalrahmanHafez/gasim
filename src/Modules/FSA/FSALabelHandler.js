import LabelHandler from "../../classes/LabelHandler";
import { str_substitute_empty } from "../../Helpers/GraphLabel.js";
import { IMaskInput, IMask, IMaskMixin } from "react-imask";
import { symbols } from "../../Helpers/Constatns";

export default class FSALabelHandler extends LabelHandler {
  getInputMasks(edge) {
    const inputMasks = [];
    const labelData = edge.data("labelData");

    if (labelData === undefined) {
      //   This means that the edge is a new edge

      var newMask = this.createIMask();
      inputMasks.push(newMask);

      return inputMasks;
    }
    // not a new Edge , renaming an edge

    const label = labelData;

    var renameMask = this.createIMask();

    renameMask.value = label;
    inputMasks.push(renameMask);

    return inputMasks;
  }

  saveInputData() {
    const masks = this.getInputMasksFromPopper();
    let label = masks[0].value;
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
