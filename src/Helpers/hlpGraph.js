import tabTypes from "../enums/tabTypes";

export const getInitalNode = (cy) => cy.$("node[?inital]")[0];
/**
 * WARNNING ONLY for FAS Simulation
 * @param {node} cynode
 * @returns {nodes[]} array of nodes
 */
export const getNodeClosure = (cynode) => {
  // TODO: edge.data("label") this means it's only avaibale to FAs
  const closure = (node) =>
    node
      .outgoers("edge")
      .filter((edge) => edge.data("label") === "ε")
      .map((edge) => edge.target());

  const discovered = closure(cynode);

  for (let i = 0; ; i++) {
    const node = discovered[i];
    if (!node) break;
    closure(node).forEach((node) => {
      if (discovered.filter((d) => d.id() === node.id()).length === 0)
        discovered.push(node);
    });
  }

  return discovered;
};

export const getNodeFromId = (cy, id) => cy.$("#" + id)[0];

function assert(condition, message) {
  if (!condition) {
    if (message) throw new Error(message);
    else throw new Error("Assertion failed");
  }
}
// TODO: PDA Label
export const parsePDAEdgeLabel = (label) => {
  // TODO: not true that its only 3 chars forex
  // "ε , Z ; SZ

  assert(label.length === 3, "label must be a 3 characters");
  const [symbol, pop, push] = label.split("");
  return { symbol, pop, push };
};
// TODO: TM Label
/**
 *
 * @param {*} label of edge, separated by | each 3 chars, or not
 * @returns {symbol, replacement, movement:Number}
 */
export const parseTMEdgeLabel = (label) => {
  // TODO: refactor parseTMEdgeLabel account for non | ,ex: abcdef
  const toLower = (str) => {
    if (typeof str === "string") return str.toLowerCase();
    else throw new Error("invalid input in parseTMEdgeLabel");
  };
  if (label.includes("|")) {
    return label.split("|").map((seg) => {
      let [symbol, replacement, movement] = seg.split("");
      if (toLower(movement) === "r") movement = +1;
      else if (toLower(movement) === "l") movement = -1;
      else if (toLower(movement) === "s") movement = 0;
      else throw new Error("Invalid movement");
      return { symbol, replacement, movement };
    });
  } else {
    const result = [];
    const parser = (seg) => {
      let [symbol, replacement, movement, ...rest] = seg;
      if (toLower(movement) === "r") movement = +1;
      else if (toLower(movement) === "l") movement = -1;
      else if (toLower(movement) === "s") movement = 0;
      else throw new Error("Invalid movement");
      result.push({ symbol, replacement, movement });
      if (rest.length > 0) parser(rest);
    };
    parser(label.split(""));
    return result;
  }
};

export const verifyInitalStateExists = (cyinst) => {
  const initalNode = cyinst.$("node[?inital]")[0];
  if (initalNode === undefined) {
    alert("Graph must contain an inital state");
    return false;
  }
  return true;
};

export const verifyAtLeastFinalState = (cyinst) => {
  const finalNodes = cyinst.$("node[?final]");
  if (finalNodes === undefined || finalNodes.length === 0) {
    alert("Graph must contain at least one final state");
    return false;
  }
  return true;
};
