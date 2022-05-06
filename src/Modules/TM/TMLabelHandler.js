import LabelHandler from "../../classes/LabelHandler";
import { formatLabel, str_substitute_empty } from "../../Helpers/GraphLabel.js";
import { IMaskInput, IMask, IMaskMixin } from "react-imask";
import { symbols } from "../../Helpers/Constatns";
import { assert } from "../../utils";
import tabTypes from "../../enums/tabTypes";
import {
  cvt_movement_to_string,
  cvt_movement_to_number,
} from "../../Helpers/GraphLabel.js";

export default class TMLabelHandler extends LabelHandler {
  constructor(tapesCount) {
    super();
    this.tapesCount = tapesCount;
  }

  getInputMasks(edge) {
    const inputMasks = [];
    const labelData = edge.data("labelData");

    if (labelData === undefined) {
      //   This means that the edge is a new edge

      for (let i = 0; i < this.tapesCount; i++) {
        var newMask = this.createIMask();
        inputMasks.push(newMask);
      }

      return inputMasks;
    }
    // not a new Edge , renaming an edge

    for (let i = 0; i < this.tapesCount; i++) {
      var renameMask = this.createIMask();

      labelData[i].movement = cvt_movement_to_string(labelData[i].movement);

      const rawStoredValue = Object.values(labelData[i]).join("");
      // console.log("rawStoredValue is ", rawStoredValue);
      renameMask.value = rawStoredValue;

      inputMasks.push(renameMask);
    }

    return inputMasks;
  }

  saveInputData() {
    const masks = this.getInputMasksFromPopper();

    const labelData = [];

    masks.forEach((mask) => {
      // console.log("mask is ", mask);
      let values = []; //could've done it recursively, but iam tired
      values = mask.masked.state._blocks[0]._blocks
        .map((b) => b.masked?._value)
        .filter((v) => v !== undefined);

      mask.masked.state._blocks[1]._blocks
        .map((b) => b.masked?._value)
        .filter((v) => v !== undefined)
        .forEach((v) => values.push(v));

      assert(values.length >= 3, "TM label must have at least 3 values");

      // if (movementNr === undefined) {
      //   alert("invalid movement, possiable {S, R, L}");
      // }

      values[0] = str_substitute_empty(values[0], symbols.rectangle);
      values[1] = str_substitute_empty(values[1], symbols.rectangle);
      values[2] = !["s", "l", "r"].includes(values[2].toLowerCase())
        ? 0
        : cvt_movement_to_number(values[2]);
      // console.log("values are ", values);

      labelData.push({
        symbol: values[0],
        replacement: values[1],
        movement: values[2],
      });
    });

    const updatedValues = {
      label: formatLabel(labelData, tabTypes.TM),
      labelData: labelData,
    };
    this.inputPopper.edge.data(updatedValues);
    return true;
  }

  createIMask() {
    const maskOptions = {
      mask: "BASEDIR",
      lazy: false,
      blocks: {
        BASE: {
          mask: "*{→}*{,}",
        },
        DIR: {
          mask: IMask.MaskedEnum,
          enum: ["S", "s", "L", "l", "R", "r"],
        },
      },
    };

    var mask = IMask(document.createElement("input"), maskOptions);
    mask.on("accept", () => {
      const rawValue = mask.masked.rawInputValue;
      //   console.log(rawValue);
      mask.value = rawValue.split(" ").join(symbols.rectangle);
    });

    return mask;
  }
}
