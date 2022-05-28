import { getInitalNode, createHeadlessCy } from "../../../utils";

function DFAEquality(dfa1, dfa2) {
  // dfa is of type FSAModel

  const cya = createHeadlessCy(dfa1.elements);
  const cyb = createHeadlessCy(dfa2.elements);

  const initalNodeA = getInitalNode(cya);
  const initalNodeB = getInitalNode(cyb);

  // The following is not nessisary, since the automaton is required to have an inital state.
  //   both don't have inital state, can't reach anyware
  if (initalNodeA === undefined && initalNodeB === undefined) return true;

  if (initalNodeA === undefined) {
    return !initalNodeB.outgoers("edge").length > 0;
  }

  if (initalNodeB === undefined) {
    return !initalNodeA.outgoers("edge").length > 0;
  }

  const visitedNodes = [];

  const isVisited = ([nodaA, nodeB]) =>
    visitedNodes.some(([na, nb]) => na === nodaA && nb === nodeB);

  const checkPair = (nodeA, nodeB) => {
    return (
      nodeA.data("inital") === nodeB.data("inital") &&
      nodeA.data("final") === nodeB.data("final")
    );
  };

  let mte = [[initalNodeA, initalNodeB]];

  const expand = ([nodeA, nodeB]) => {
    // If not Visited
    if (isVisited([nodeA, nodeB])) return;

    // add to Visited
    visitedNodes.push([nodeA, nodeB]);

    // checks
    if (checkPair(nodeA, nodeB) === false) {
      return false;
    }

    // edges check, every edge label must match in the pair
    const edgesA = nodeA.outgoers("edge");
    const edgesB = nodeB.outgoers("edge");

    if (edgesA.length !== edgesB.length) return false;

    for (let ea of edgesA) {
      let found = false;
      for (let eb of edgesB) {
        if (ea.data("label") === eb.data("label")) found = true;
      }
      if (found === false) return false;
    }

    // add to more to explore
    edgesA.forEach((ea) => {
      const newNodeA = ea.target();
      const newNodeB = nodeB
        .outgoers("edge[label='" + ea.data("label") + "']")[0]
        .target();

      mte.push([newNodeA, newNodeB]);
    });
  };

  //   debugger;
  while (mte.length > 0) {
    if (expand(mte.pop()) === false) {
      return false;
    }
  }

  return true;
  //   TODO:
}

export default DFAEquality;
