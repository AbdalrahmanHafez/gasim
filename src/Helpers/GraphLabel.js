import { parsePDAEdgeLabel, parseTMEdgeLabel } from "./hlpGraph";
import tabTypes from "../enums/tabTypes";
import TMConfig from "../classes/TMConfig";
import Config from "../classes/Config";
import PDAConfig from "../classes/PDAConfig";

var inputPopper;
const str_substitute_empty = (str, sub) => (str === "" ? sub : str);

const cvt_movement_to_string = (movement) => {
  return movement === 0
    ? "S"
    : movement === 1
    ? "R"
    : movement === -1
    ? "L"
    : undefined;
};
const cvt_movement_to_number = (movement) => {
  movement = movement.toUpperCase();
  return movement === "S"
    ? 0
    : movement === "R"
    ? 1
    : movement === "L"
    ? -1
    : undefined;
};

const formatLabel = (labelData, tabType) => {
  switch (tabType) {
    case tabTypes.FA:
      return `${labelData}`;
    case tabTypes.PDA:
      return `${labelData.symbol},${labelData.pop} → ${labelData.push}`;
    case tabTypes.TM:
      // for TM labelData is Array
      return labelData
        .map(
          (l) =>
            `${l.symbol} → ${l.replacement}, ${cvt_movement_to_string(
              l.movement
            )}`
        )
        .join("\n");
    default:
      break;
  }
};

const saveInputData = () => {
  let values = [...inputPopper.state.elements.popper.children].map(
    (ele) => ele.value
  );
  //   console.log(values);
  //   all values must be at most 1 char
  // if (values.find((v) => v.length > 1) !== undefined) {
  //   alert("all values must be 1 char or less");
  //   return false;
  // }

  const tabType = inputPopper.tabType;
  switch (tabType) {
    case tabTypes.FA:
      let label = values[0];
      label = str_substitute_empty(label, "ε");

      inputPopper.edge.data({ label, labelData: label });
      break;
    case tabTypes.PDA:
      {
        values = values.map((v) => str_substitute_empty(v, "ε"));
        const data = { symbol: values[0], pop: values[1], push: values[2] };
        const updatedValues = {
          label: formatLabel(data, tabType),
          labelData: data,
        };
        inputPopper.edge.data(updatedValues);
      }
      break;

    case tabTypes.TM:
      const labelData = [];
      for (let i = 0; i < values.length; i += 3) {
        const movementNr = cvt_movement_to_number(values[i + 2]);
        if (movementNr === undefined) {
          alert("invalid movement, possiable {S, R, L}");
          return false;
        }
        values[i] = str_substitute_empty(values[i], TMConfig.empty);
        values[i + 1] = str_substitute_empty(values[i + 1], TMConfig.empty);

        labelData.push({
          symbol: values[i],
          replacement: values[i + 1],
          movement: movementNr,
        });
      }
      const updatedValues = {
        label: formatLabel(labelData, tabType),
        labelData: labelData,
      };
      console.log("updated values", updatedValues);
      inputPopper.edge.data(updatedValues);
      break;
    default:
      break;
  }

  return true;
};

const handleInputOutFocus = () => {
  if (inputPopper) {
    if (saveInputData() === false) return;
    inputPopper.state.elements.popper.remove();
    inputPopper.destroy();
    inputPopper = undefined;
  }
};
const genInputsBasedOnType = (edge, tabType) => {
  const inputEles = [];
  const labelData = edge.data("labelData");

  if (labelData === undefined) {
    //   This means that the edge is a new edge
    let inputCount;
    if (tabType === tabTypes.FA) inputCount = 1;
    else if (tabType === tabTypes.PDA) inputCount = 3;
    else if (tabType === tabTypes.TM) inputCount = 3;
    else throw new Error("invalid tab type");

    for (let i = 0; i < inputCount; i++) {
      const inputElm = document.createElement("input");
      inputEles.push(inputElm);
    }

    return inputEles;
  }

  switch (tabType) {
    case tabTypes.FA:
      const label = labelData;
      const inputElm = document.createElement("input");
      inputElm.setAttribute("value", label);
      inputEles.push(inputElm);
      break;
    case tabTypes.PDA:
      for (let value of Object.values(labelData)) {
        const inputElm = document.createElement("input");
        inputElm.setAttribute("value", value);
        inputEles.push(inputElm);
      }
      break;
    case tabTypes.TM:
      labelData.forEach((tapeData) => {
        for (let [key, value] of Object.entries(tapeData)) {
          const inputElm = document.createElement("input");
          inputElm.setAttribute(
            "value",
            key === "movement" ? cvt_movement_to_string(value) : value
          );
          inputEles.push(inputElm);
        }
      });

      break;
    default:
      throw new Error("invalid tab Type");
  }
  return inputEles;
};

const displayInputs = (edge, tabType) => {
  const cy = edge.cy();
  if (inputPopper !== undefined) return;
  inputPopper = edge.popper({
    content: () => {
      let div = document.createElement("div");
      div.classList.add("popperInputContainer");

      const inputEles = genInputsBasedOnType(edge, tabType);

      inputEles.forEach((ele) => div.append(ele));

      document.body.appendChild(div);
      inputEles[0].focus();
      return div;
    },
    popper: {
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, -20],
          },
        },
      ],
    },
  });
  inputPopper.tabType = tabType;
  inputPopper.cy = cy;
  inputPopper.edge = edge;
};

export const promptLabel_for_new_edge = (e, tabType) => {
  displayInputs(e, tabType);
};

const handleESC = () => {
  if (inputPopper) {
    const storedEdge = inputPopper.edge;
    // that means its a new edge and should be canceld
    // otherwise its a rename action
    if (storedEdge.data("labelData") === undefined) storedEdge.remove();

    inputPopper.state.elements.popper.remove();
    inputPopper.destroy();
    inputPopper = undefined;
  }
};

export const setLabelEvents = (cy, tabType) => {
  cy.on("dbltap", "edge", (e) => displayInputs(e.target, tabType));

  cy.on("tap pan zoom", function (e) {
    if (e.target === cy) {
      handleInputOutFocus();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.keyCode !== 27) return;
    console.log("ESC");
    handleESC();
  });
};

export const parseExampleLabels = (label, tabType) => {
  // TODO: parseGraphLabel then replace examples by the new from cy.json().elments...
  switch (tabType) {
    case tabTypes.FA: {
      return { label: label, labelData: label };
    }
    case tabTypes.PDA: {
      const parsed = parsePDAEdgeLabel(label);
      const displayedAs = formatLabel(parsed, tabType);
      return { label: displayedAs, labelData: parsed };
    }
    case tabTypes.TM: {
      const parsed = parseTMEdgeLabel(label);
      const displayAs = formatLabel(parsed, tabType);
      return { label: displayAs, labelData: parsed };
    }
    default:
      throw new Error("TabType not valid");
  }

  return null;
};

// Helper functions
export const simTypeToEmptyValue = (simType) => {
  switch (simType) {
    case tabTypes.FA:
      return Config.empty;
    case tabTypes.PDA:
      return PDAConfig.empty;
    case tabTypes.TM:
      return TMConfig.empty;
    default:
      throw new Error("invalid simType inside simTypeToEmptyValue");
  }
};
