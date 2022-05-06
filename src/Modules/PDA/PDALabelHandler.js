import LabelHandler from "../../classes/LabelHandler";
import { str_substitute_empty } from "../../Helpers/GraphLabel.js";
import { IMaskInput, IMask, IMaskMixin } from "react-imask";
import { symbols } from "../../Helpers/Constatns";

export default class PDALabelHandler extends LabelHandler {
  getInputMasks(edge) {
    const inputEles = [];
    const labelData = edge.data("labelData");

    if (labelData === undefined) {
      //   This means that the edge is a new edge

      var newMask = this.createIMask();
      inputEles.push(newMask);

      return inputEles;
    }
    // not a new Edge , renaming an edge

    var renameMask = this.createIMask();

    const rawStoredValue = Object.values(labelData).join("");
    renameMask.value = rawStoredValue;

    inputEles.push(renameMask);

    return inputEles;
  }

  saveInputData() {
    const masks = this.getInputMasksFromPopper();
    console.log("masks are ", masks);
    let mask = masks[0];
    let values = mask.masked.state._blocks
      .map((b) => b.masked?._value)
      .filter(Boolean);
    // console.log("values are ", values);
    values = values.map((v) => str_substitute_empty(v, "ε"));
    const data = { symbol: values[0], pop: values[1], push: values[2] };
    const updatedValues = {
      label: mask.value,
      labelData: data,
    };
    this.inputPopper.edge.data(updatedValues);
    return true;
  }

  createIMask() {
    const maskOptions = { mask: "*{,}*{→}*", placeholderChar: "_" };

    var mask = IMask(document.createElement("input"), maskOptions);
    mask.on("accept", () => {
      const rawValue = mask.masked.rawInputValue;
      //   console.log(rawValue);
      mask.value = rawValue.split(" ").join(symbols.epsilon);
    });

    return mask;
  }
}
