import {
  createHeadlessCy,
  getInitalNode,
  getNodeClosure,
  getNodeFromId,
} from "../../utils";
import { v4 as uuidv4 } from "uuid";

import { Set, is } from "immutable";

export default class NFAtoDFA {
  constructor(FSAModel) {
    this.FSAModel = FSAModel;
    this.dstCy = null;
  }

  get exportResult() {
    return this.dstCy.json().elements;
  }

  checkValid() {
    const srcCy = createHeadlessCy(this.FSAModel.elements);

    const scy = srcCy;

    const initalNode = scy.$("node[?inital]")[0];
    if (!initalNode) throw new Error("No inital node found");

    return true;
  }

  convert(dstCy) {
    const srcCy = createHeadlessCy(this.FSAModel.elements);
    this.dstCy = dstCy;

    console.log("Converting NFA to DFA");
    const scy = srcCy;
    const dcy = dstCy;

    const initalNode = scy.$("node[?inital]")[0];
    if (!initalNode) throw new Error("No inital node found");

    const initalNodes = getNodeClosure(initalNode);
    const originalNodes = scy.nodes();

    const printId = (eles) => {
      // elems either [nodes or Sets]
      if (eles.length === 0) return "empty";
      const first = eles[0];
      if (first instanceof Set) {
        return eles
          .map((s) =>
            s
              .toJS()
              .map((e) => e.data("id"))
              .join("|")
          )
          .join("*");
      } else {
        return eles.map((smt) => smt.data("id")).join("|");
      }
    };

    const getLabelsFromNode = (node) =>
      node.outgoers("edge").map((edge) => edge.data("label"));

    const getTargetNodeSetFromNodeSetAndTrnasition = (
      nodeSet,
      transitionlbl
    ) => {
      let targetNodeSet = new Set();
      nodeSet.forEach((node) => {
        node
          .outgoers("edge")
          .filter((edge) => edge.data("label") === transitionlbl)
          .map((edge) => edge.target())
          .flatMap((node) => [...getNodeClosure(node), node])
          .forEach((node) => {
            targetNodeSet = targetNodeSet.add(node);
          });
      });
      return targetNodeSet;
    };

    const createTransitionNodeSet = (nodesetA, nodesetB, label) => {
      // TODO: assume they aren't in the graph already

      const addNode = (nodeSet) => {
        // if node exists
        // debugger;
        const nodeName = nodeSet.map((node) => node.data("name")).join(",");
        const alreadyNode = dcy.$(`node[id="cnv-${nodeName}"]`);
        if (alreadyNode.length > 0 && !originalNodes.includes(alreadyNode[0]))
          return alreadyNode[0];

        const isInital = nodeSet.some((node) => node.data("inital"));
        const isFinal = nodeSet.some((node) => node.data("final"));

        return dcy.add({
          group: "nodes",
          data: {
            id: `cnv-${nodeName}`,
            name: nodeName,
            inital: isInital,
            final: isFinal,
          },
        });
      };
      const connectNodes = (nodeA, nodeB, label) => {
        const alreadyExists = dcy.$(
          `edge[id="cnve-${nodeA.data("name")}${nodeB.data(
            "name"
          )}-lbl:${label}"]`
        );
        if (alreadyExists.length > 0) return;

        dcy.add({
          group: "edges",
          data: {
            id: `cnve-${nodeA.data("name")}${nodeB.data("name")}-lbl:${label}`,
            source: nodeA.data("id"),
            target: nodeB.data("id"),
            label: label,
          },
        });
      };
      const nodeA = addNode(nodesetA);
      const nodeB = addNode(nodesetB);

      connectNodes(nodeA, nodeB, label);
    };

    let mte = [new Set([...initalNodes, initalNode])];

    const expand = (nodeSet) => {
      /** Algorithm
          initalNodeSet = NodeSet(closure(initalNode))
          initalNode = Res.addNode(initalNodeSet)
          
          mte = [initalNode]
          while(mte not empty)
            mte.flatMap(node => func(node))
  
          def func(Rnode):
            NodeSet = Rnode.NodeSet
            for each node in NodesSet:
              uniqueLabels set add getUniqueLabelsFromNode(node)
            uniqueLabels.remove(epsilon) if has it
            
            let moreToExplore = []
            foreach lbl in uniqueLabels:
              targetNodeSet = NodesSet.withTransition(lbl).closure()
              create transition to targetNodeSet with lbl
                if(targetNodeSet not a node in the graph)
                  NodeSetNode to targetNodeSetNode NEW transition lbl
                  moreToExplore += .|. Rnode
                else connect with that node
            return moreToExplore
         *  */

      let uniqueLabels = new Set();

      nodeSet.forEach((node) => {
        // debugger;
        const labels = getLabelsFromNode(node);
        // console.log(labels);
        labels.forEach((label) => {
          uniqueLabels = uniqueLabels.add(label);
        });
      });
      uniqueLabels = uniqueLabels.remove("ε");
      // console.log("uniqueLabels", uniqueLabels.toJS());

      let moreToExplore = [];
      uniqueLabels.forEach((label) => {
        let targetNodeSet = getTargetNodeSetFromNodeSetAndTrnasition(
          nodeSet,
          label
        );

        // TODO: there's something wrong, with the following example machine, i prevented it by not adding another duplicate edge
        /**
         *  nodes: [
        {
          data: { id: "a", name: "a", inital: true, final: false },
        },
        {
          data: { id: "b", name: "b", inital: false, final: false },
        },
        {
          data: { id: "s", name: "s", inital: false, final: false },
        },
        { data: { id: "f", name: "f", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "bf", source: "b", target: "f", label: "b" } },
        { data: { id: "as", source: "a", target: "s", label: "ε" } },
        { data: { id: "sb", source: "s", target: "b", label: "e" } },
      ],
      
         */
        // console.log("-----------");
        // console.log("nodeseet", printId(nodeSet));
        // console.log("targetnodeset", printId(targetNodeSet));
        // console.log("label", label);

        createTransitionNodeSet(nodeSet, targetNodeSet, label);

        moreToExplore.push(targetNodeSet);
      });
      return moreToExplore;
      // console.log(uniqueLabels.toJS());
    };

    let visited = []; // Set[] visited resultant nodes

    while (mte.length !== 0) {
      // console.count("EXPANDING");
      mte = mte.flatMap((ns) => {
        let more,
          res = [];
        more = expand(ns);
        visited.push(ns);
        res = more.filter((s) => !visited.some((v) => is(s, v)));

        return res;
      });

      // console.log("mte", printId(mte));
      // console.log("visited", printId(visited));
    }

    dcy.layout({ name: "cose" }).run();
  }
}
