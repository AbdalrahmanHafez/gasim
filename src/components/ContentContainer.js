import React, { useContext, useEffect, useState } from "react";
import SimPanel from "./SimPanel";
import { StoreContext } from "../Store.js";
import UI from "../classes/UI";
import { Menu, Dropdown, Checkbox } from "antd";
import { DownOutlined } from "@ant-design/icons";
import steppingStrategies from "../enums/steppingStrategies";
import tabTypes from "../enums/tabTypes";
import InputByFormalDefinition from "./InputByFormalDefinition";
import ConversionPanel from "../components/ConversionPanel";
import { Set, is } from "immutable";
import { getNodeClosure } from "../Helpers/hlpGraph";

const $ = window.jQuery;

const log = (msg) => console.log(`[Content Container] ${msg}`);
const map_ttype_to_strategy = (ttype) => {
  if (ttype === tabTypes.FA || ttype === tabTypes.PDA)
    return Object.keys(steppingStrategies);
  else if (ttype === tabTypes.TM) {
    return Object.keys(steppingStrategies).filter(
      (k) => k !== "STEP_WITH_CLOSURE"
    );
  } else if (ttype === tabTypes.IFD) {
    return Object.keys(steppingStrategies);
  } else {
    throw new Error(`Unknown tab type: ${ttype}`);
  }
};
const ContentContainer = ({ tabIdx, tabInfo, setTabInfo }) => {
  log("Render");
  const [, forceRender] = useState({});
  const [fake, setFake] = useState(false);

  const { tabType, showConversion } = tabInfo;

  const [ui, setui] = useState(new UI({ ...tabInfo, tabIdx }));
  const [enableFastrun, setEnableFastrun] = useState(false);

  const [showSim, setShowSim] = useState(false);

  const helpers = { forceRender, setShowSim };
  ui.helpers = helpers;

  useEffect(() => {
    const elm1 = {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
          position: { x: 0, y: 0 },
          selected: true,
          locked: false,
        },
        {
          data: { id: "q4", name: "q4", inital: false, final: false },
        },
        {
          data: { id: "b", name: "B", inital: false, final: true },
          parent: "a",
          position: { x: 100, y: 100 },
          renderedPosition: { x: 100, y: 100 },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
          parent: "a",
        },
        { data: { id: "d", name: "D", inital: false, final: true } },
        { data: { id: "q5", name: "q5", inital: false, final: false } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "ba", source: "b", target: "a", label: "b" } },
        { data: { id: "ac", source: "a", target: "c", label: "c" } },
        { data: { id: "cd", source: "c", target: "d", label: "d" } },
        { data: { id: "aq4", source: "a", target: "q4", label: "a" } },
        { data: { id: "dq5", source: "d", target: "q5", label: "ε" } },
      ],
    };

    const elm2 = {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
        },
        {
          data: { id: "f", name: "F", inital: false, final: false },
        },
        {
          data: { id: "w", name: "W", inital: false, final: true },
        },
        {
          data: { id: "g", name: "G", inital: false, final: false },
        },
        {
          data: { id: "h", name: "H", inital: false, final: true },
        },
        {
          data: { id: "b", name: "B", inital: false, final: false },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
        },
        {
          data: { id: "d", name: "D", inital: false, final: false },
        },
        { data: { id: "e", name: "E", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "af", source: "a", target: "f", label: "ε" } },
        { data: { id: "fg", source: "f", target: "g", label: "a" } },
        { data: { id: "fw", source: "f", target: "w", label: "ε" } },
        { data: { id: "gh", source: "g", target: "h", label: "b" } },
        { data: { id: "bc", source: "b", target: "c", label: "ε" } },
        { data: { id: "cd", source: "c", target: "d", label: "ε" } },
        { data: { id: "db", source: "d", target: "b", label: "ε" } },
        { data: { id: "de", source: "d", target: "e", label: "b" } },
      ],
    };

    const elm3 = {
      nodes: [
        {
          data: {
            id: "a",
            name: "Node A",
            inital: true,
            final: false,
          },
        },
        {
          data: { id: "b", name: "B", inital: false, final: false },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
        },
        {
          data: { id: "d", name: "D", inital: false, final: false },
        },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "bb", source: "b", target: "b", label: "ε" } },
        { data: { id: "bc", source: "b", target: "c", label: "ε" } },
        { data: { id: "cd", source: "c", target: "d", label: "b" } },
      ],
    };

    const elmPDA = {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
        },
        {
          data: { id: "f", name: "F", inital: false, final: false },
        },
        {
          data: { id: "w", name: "W", inital: false, final: true },
        },
        {
          data: { id: "g", name: "G", inital: false, final: false },
        },
        {
          data: { id: "h", name: "H", inital: false, final: true },
        },
        {
          data: { id: "b", name: "B", inital: false, final: false },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
        },
        {
          data: { id: "d", name: "D", inital: false, final: false },
        },
        { data: { id: "e", name: "E", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "aZX" } },
        { data: { id: "af", source: "a", target: "f", label: "εεS" } },
        { data: { id: "fg", source: "f", target: "g", label: "aεε" } },
        { data: { id: "fw", source: "f", target: "w", label: "εSK" } },
        { data: { id: "gh", source: "g", target: "h", label: "bSε" } },
        { data: { id: "bc", source: "b", target: "c", label: "εεε" } },
        { data: { id: "cd", source: "c", target: "d", label: "εεε" } },
        { data: { id: "db", source: "d", target: "b", label: "εεε" } },
        { data: { id: "de", source: "d", target: "e", label: "bXε" } },
      ],
    };

    const elmTM = {
      nodes: [
        {
          data: { id: "a", inital: true, final: false },
        },
        {
          data: { id: "b", inital: false, final: false },
        },
        {
          data: { id: "c", inital: false, final: false },
        },
        { data: { id: "d", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "aaR|abR" } },
        { data: { id: "ba", source: "b", target: "a", label: "▢bR|▢cR" } },
        { data: { id: "bc", source: "b", target: "c", label: "aaR|acR" } },
        { data: { id: "bd", source: "b", target: "d", label: "abR|akR" } },
      ],
    };

    const elmTM2 = {
      nodes: [
        {
          data: { id: "a", inital: true, final: false },
        },
        {
          data: { id: "b", inital: false, final: false },
        },
        {
          data: { id: "c", inital: false, final: false },
        },
        { data: { id: "d", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "aaR" } },
        { data: { id: "ba", source: "b", target: "a", label: "▢bR" } },
        { data: { id: "bc", source: "b", target: "c", label: "aaR" } },
        { data: { id: "bd", source: "b", target: "d", label: "abR" } },
      ],
    };

    const elmTM3 = {
      nodes: [
        {
          data: { id: "q0", inital: true, final: false },
        },
        {
          data: { id: "q1", inital: false, final: false },
        },
        {
          data: { id: "q2", inital: false, final: false },
        },
        { data: { id: "q3", inital: false, final: false } },
        { data: { id: "q4", inital: false, final: false } },
        { data: { id: "q5", inital: false, final: false } },
        { data: { id: "q6", inital: false, final: false } },
      ],
      edges: [
        { data: { id: "q0q1", source: "q0", target: "q1", label: "▢▢R|▢▢R" } },
        { data: { id: "q1q2", source: "q1", target: "q2", label: "▢#R|▢aS" } },
        { data: { id: "q2q3", source: "q2", target: "q3", label: "▢#R|aaS" } },
        { data: { id: "q3q3", source: "q3", target: "q3", label: "▢aR|aaR" } },
        { data: { id: "q3q4", source: "q3", target: "q4", label: "▢▢S|▢▢L" } },
        { data: { id: "q4q4", source: "q4", target: "q4", label: "▢bR|aaL" } },
        { data: { id: "q4q5", source: "q4", target: "q5", label: "▢▢S|▢▢R" } },
        { data: { id: "q5q5", source: "q5", target: "q5", label: "▢cR|aaR" } },
        { data: { id: "q5q6", source: "q5", target: "q6", label: "▢▢S|▢aL" } },
        { data: { id: "q6q6", source: "q6", target: "q6", label: "▢▢S|aaL" } },
        { data: { id: "q6q3", source: "q6", target: "q3", label: "▢#R|▢▢R" } },
      ],
    };

    const elm8 = {
      nodes: [
        {
          data: { id: "q4", name: "q4", inital: true, final: false },
        },
        {
          data: { id: "q6", name: "q6", inital: false, final: false },
        },
        {
          data: { id: "q5", name: "q5", inital: false, final: false },
        },
        {
          data: { id: "q7", name: "q7", inital: false, final: false },
        },
        {
          data: { id: "q0", name: "q0", inital: false, final: false },
        },
        {
          data: { id: "q1", name: "q1", inital: false, final: false },
        },
        {
          data: { id: "q3", name: "q3", inital: false, final: false },
        },
        {
          data: { id: "q2", name: "q2", inital: false, final: false },
        },
      ],
      edges: [
        { data: { id: "q4q6", source: "q4", target: "q6", label: "k" } },
        { data: { id: "q4q5", source: "q4", target: "q5", label: "a" } },
        { data: { id: "q5q7", source: "q5", target: "q7", label: "b" } },
        { data: { id: "q7q4", source: "q7", target: "q4", label: "s" } },
        { data: { id: "q4q0", source: "q4", target: "q0", label: "ε" } },
        { data: { id: "q0q1", source: "q0", target: "q1", label: "a" } },
        { data: { id: "q1q0", source: "q1", target: "q0", label: "w" } },
        { data: { id: "q7q1", source: "q7", target: "q1", label: "a" } },
        { data: { id: "q1q3", source: "q1", target: "q3", label: "ε" } },
        { data: { id: "q0q2", source: "q0", target: "q2", label: "a" } },
        { data: { id: "q2q3", source: "q2", target: "q3", label: "c" } },
      ],
    };

    if (tabIdx === 0) ui.injectCy(elm1);
    else if (tabIdx === 1) ui.injectCy(elm2);
    else if (tabIdx === 2) ui.injectCy(elm3);
    else if (tabIdx === 3) ui.injectCy(elmPDA);
    else if (tabIdx === 4) ui.injectCy(elmTM);
    else if (tabIdx === 5) ui.injectCy(elmTM2);
    else if (tabIdx === 6) ui.injectCy(elmTM3);
    else if (tabIdx === 8) ui.injectCy(elm8);
    else if (tabType !== tabTypes.IFD) ui.injectCy({ nodes: [], edges: [] });

    // TODO: Dynamic sim, for given tab Type
    // inject cy with empty elm
  }, [ui]);

  useEffect(() => {
    if (!fake) return; //TODO: very wrong please fix
    console.log("trigger conversion");
    const cy = ui.getCy();
    const initalNode = cy.$("node[?inital]")[0];
    const initalNodes = getNodeClosure(initalNode);
    const originalNodes = cy.nodes();

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
        const alreadyNode = cy.$(`node[id="cnv-${nodeName}"]`);
        if (alreadyNode.length > 0 && !originalNodes.includes(alreadyNode[0]))
          return alreadyNode[0];

        return cy.add({
          group: "nodes",
          data: {
            id: `cnv-${nodeName}`,
            name: nodeName,
            inital: false,
            final: false,
          },
        });
      };
      const connectNodes = (nodeA, nodeB, label) => {
        cy.add({
          group: "edges",
          data: {
            id: `cnve-${nodeA.data("name")}${nodeB.data("name")}`,
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
      console.log("uniqueLabels", uniqueLabels.toJS());

      let moreToExplore = [];
      uniqueLabels.forEach((label) => {
        let targetNodeSet = getTargetNodeSetFromNodeSetAndTrnasition(
          nodeSet,
          label
        );

        console.log("nodeseet", printId(nodeSet));
        console.log("targetnodeset", printId(targetNodeSet));
        console.log("label", label);
        createTransitionNodeSet(nodeSet, targetNodeSet, label);

        moreToExplore.push(targetNodeSet);
      });
      return moreToExplore;
      // console.log(uniqueLabels.toJS());
    };

    let visited = []; // Set[] visited resultant nodes

    while (mte.length !== 0) {
      console.count("EXPANDING");
      mte = mte.flatMap((ns) => {
        let more,
          res = [];
        more = expand(ns);
        visited.push(ns);
        res = more.filter((s) => !visited.some((v) => is(s, v)));

        return res;
      });

      console.log("mte", printId(mte));
      console.log("visited", printId(visited));
    }

    cy.layout({ name: "cose" }).run();
  }, [fake, ui]);

  const menu = (
    <Menu>
      {map_ttype_to_strategy(tabType).map((key, idx) => (
        <Menu.Item key={idx}>
          <a
            href="#"
            onClick={() => {
              ui.handleStartSimulation(steppingStrategies[key]);
            }}
          >
            {steppingStrategies[key]}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );

  const showIFD = tabType === tabTypes.IFD;

  return (
    <>
      {!showIFD && (
        <div id="btnSimulate">
          <Dropdown overlay={menu}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              {"Simulate  "}
              <DownOutlined />
            </a>
          </Dropdown>
        </div>
      )}

      <div id="ckbFastrun">
        <Checkbox
          id="ckbFastrun"
          checked={enableFastrun}
          onChange={(e) => setEnableFastrun(e.target.checked)}
        >
          FastRun
        </Checkbox>
      </div>

      <button
        id="testButton"
        onClick={() => {
          setFake(true);
        }}
      >
        Convert NFA to DFA (testing)
      </button>

      <div style={{ display: "flex" }}>
        {showIFD && (
          <div style={{ flexGrow: 1, marginLeft: 10 }}>
            <InputByFormalDefinition
              ui={ui}
              tabInfo={tabInfo}
              setTabInfo={setTabInfo}
            />
          </div>
        )}

        {!showIFD && <div id={`cy-${tabIdx}`} className="cy" />}
        {/* {showConversion && <ConversionPanel ui={ui} />} */}

        {showSim && (
          <SimPanel
            isFastrun={enableFastrun}
            tabIdx={tabIdx}
            ui={ui}
            tabType={tabInfo.tabType}
            tabInfo={tabInfo}
          />
        )}
      </div>
    </>
  );
};

export default ContentContainer;
