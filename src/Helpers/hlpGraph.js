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
  if (label.includes("|")) {
    return label.split("|").map((seg) => {
      let [symbol, replacement, movement] = seg.split("");
      if (movement === "R") movement = +1;
      else if (movement === "L") movement = -1;
      else if (movement === "S") movement = 0;
      else throw new Error("Invalid movement");
      return { symbol, replacement, movement };
    });
  } else {
    const result = [];
    const parser = (seg) => {
      let [symbol, replacement, movement, ...rest] = seg;
      if (movement === "R") movement = +1;
      else if (movement === "L") movement = -1;
      else if (movement === "S") movement = 0;
      else throw new Error("Invalid movement");
      result.push({ symbol, replacement, movement });
      if (rest.length > 0) parser(rest);
    };
    parser(label.split(""));
    return result;
  }
};
