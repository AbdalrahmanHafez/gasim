import tabTypes from "../enums/tabTypes";

export const getInitalNode = (cy) => cy.$("node[?inital]")[0];
export const getNodeClosure = (cynode) => {
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
export const parseTMEdgeLabel = (label) => {
  return label.split("|").map((seg) => {
    let [symbol, replacement, movement] = seg.split("");
    if (movement === "R") movement = +1;
    else if (movement === "L") movement = -1;
    else if (movement === "S") movement = 0;
    else throw new Error("Invalid movement");
    return { symbol, replacement, movement };
  });
};
