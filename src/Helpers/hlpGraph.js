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
