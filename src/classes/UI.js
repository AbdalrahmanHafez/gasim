import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import edgehandles from "cytoscape-edgehandles";
import contextMenus from "cytoscape-context-menus";
import Simulation from "./Simulation";
import NFASimulation from "./NFASimulation";
import PDASimulation from "./PDASimulation";
import TMSimulation from "./TMSimulation";
import { getNodeFromId } from "../Helpers/hlpGraph";
import edgeEditing from "cytoscape-edge-editing";
import konva from "konva";
import $ from "jquery";
import tabType from "../enums/tabTypes";
import {
  promptLabel_for_new_edge,
  parseExampleLabels,
  setLabelEvents,
} from "../Helpers/GraphLabel";

cytoscape.use(edgehandles);
cytoscape.use(contextMenus);
cytoscape.use(popper);
// cytoscape.use(edgeEditing);
// edgeEditing(cytoscape, $, konva); // register extension

const log = (msg) => console.log(`[UI] ${msg}`);

export default class UI {
  constructor({ tabIdx, tabType }) {
    this.tabIdx = tabIdx;
    this.tabId = `tab-${tabIdx}`;
    this.cyId = `cy-${tabIdx}`;
    this.tabType = tabType;
    this.cy = undefined;
    this.sim = undefined;
    this.handleStartSimulation = this.handleStartSimulation.bind(this);
    this.handleStartSimulationTODO = this.handleStartSimulationTODO.bind(this);
    this.helpers = {};
  }
  test() {
    // this.cy.json({ elements: elm2 });
    // this.cy.
  }
  clearHighlighted() {
    // TODO: lookat cy.batch()
    this.cy
      .$("node, edge")
      .toArray()
      .forEach((n) => n.removeClass("highlighted"));
  }
  #highlightConfigs(configs) {
    // debugger;
    // this.cy.nodes().classes([]);
    this.clearHighlighted();
    configs.forEach((config) => {
      getNodeFromId(this.cy, config.stateId).addClass("highlighted");

      config.takenEdges?.forEach((edge) => edge.addClass("highlighted"));
    });
  }
  actionSimulationStepAll() {
    // this.cy.nodes().classes([]);
    this.clearHighlighted();
    this.sim.actionStepAll();
    this.#highlightConfigs(this.sim.configs);

    this.helpers.forceRender({});
  }

  handleStartSimulation(steppingStrategy) {
    log("clicked start simulation");

    const initalNode = this.cy.$("node[?inital]")[0];
    if (!initalNode) {
      console.log("[SIM] no inital exiting");
      alert("No inital node found. right click on a node to spcifiy initial");
      return;
    }

    let inputString = undefined;
    if (this.tabType === tabType.FA || this.tabType === tabType.PDA) {
      //  inputString = "ab";
      inputString = prompt("Enter input string", "abcd");

      if (inputString === null) return; // this will allow empty string ''
      inputString = inputString.trim();
    }

    if (this.tabType === tabType.FA) {
      this.sim = new NFASimulation(this, inputString, steppingStrategy);
    } else if (this.tabType === tabType.PDA) {
      this.sim = new PDASimulation(this, inputString, steppingStrategy);
    } else if (this.tabType === tabType.TM) {
      // TODO: Dyanimc tm input

      let tapesCount = +prompt("Enter number of tapes", 2);
      // let tapesCount = this.tabIdx === 5 ? 1 : 2;

      const input = Array(tapesCount)
        .fill("")
        .map((_, idx) => prompt(`Enter input for tape ${idx + 1}`, ""));

      // const input = ["a", "a"];
      // const input = ["aaa", "aaa"];
      // const input = ["", ""];
      this.sim = new TMSimulation(this, input, steppingStrategy);
    }

    // Highlight the inital nodes
    this.#highlightConfigs(this.sim.configs);

    this.helpers.setShowSim(true);
    this.helpers.forceRender({}); // this was added to rerender the configs on simpanel
  }
  handleStartSimulationTODO(simType, steppingStrategy, TMTapesCount) {
    // TODO: Merge this to handleStartSimulation
    log("clicked start simulation");

    const initalNode = this.cy.$("node[?inital]")[0];
    if (!initalNode) {
      console.log("[SIM] no inital exiting");
      alert("No inital node found. right click on a node to spcifiy initial");
      return;
    }

    let inputString = undefined;
    if (simType === tabType.FA || simType === tabType.PDA) {
      //  inputString = "ab";
      inputString = prompt("Enter input string", "abcd");

      if (inputString === null) return; // this will allow empty string ''
      inputString = inputString.trim();
    }

    if (simType === tabType.FA) {
      this.sim = new NFASimulation(this, inputString, steppingStrategy);
    } else if (simType === tabType.PDA) {
      this.sim = new PDASimulation(this, inputString, steppingStrategy);
    } else if (simType === tabType.TM) {
      // TODO: Dyanimc tm input

      // let tapesCount = +prompt("Enter number of tapes", 2);
      // let tapesCount = this.tabIdx === 5 ? 1 : 2;
      let tapesCount = TMTapesCount;

      const input = Array(tapesCount)
        .fill("")
        .map((_, idx) => prompt(`Enter input for tape ${idx + 1}`, ""));

      // const input = ["a", "a"];
      // const input = ["aaa", "aaa"];
      // const input = ["", ""];
      this.sim = new TMSimulation(this, input, steppingStrategy);
    }

    // Highlight the inital nodes
    this.#highlightConfigs(this.sim.configs);

    this.helpers.setShowSim(true);
    this.helpers.forceRender({}); // this was added to rerender the configs on simpanel
  }

  actionSimulationReset() {
    this.clearHighlighted();

    if (this.sim instanceof NFASimulation) {
      this.sim = new NFASimulation(
        this,
        this.sim.inputString,
        this.sim.steppingStrategy
      );
    } else if (this.sim instanceof PDASimulation) {
      this.sim = new PDASimulation(
        this,
        this.sim.inputString,
        this.sim.steppingStrategy
      );
    } else if (this.sim instanceof TMSimulation) {
      this.sim = new TMSimulation(
        this,
        this.sim.inputs,
        this.sim.steppingStrategy
      );
    } else {
      throw new Error("Can't reset unkown Simulation type");
    }

    this.#highlightConfigs(this.sim.configs);
    this.helpers.forceRender({});
  }

  injectCy(elements) {
    elements.edges?.forEach((edge) => {
      edge.data = {
        ...edge.data,
        ...parseExampleLabels(edge.data.label, this.tabType),
      };
    });

    if (!window.cyinst) window.cyinst = [];
    var cy = cytoscape({
      container: document.getElementById(this.cyId),
      style: [
        {
          selector: "node",
          style: {
            content: "data(id)",
            "background-color": "#666",
            "foreground-color": "white",
            "border-width": 2,
            "border-style": "solid",
            "border-color": "black",
            "text-valign": "center",
            "text-halign": "center",
            color: "white",
            height: "60px",
            width: "60px",
          },
        },
        {
          selector: "node[name]",
          style: {
            "background-color": "#666",
            content: "data(name)",
            "border-width": 2,
            "border-style": "solid",
            "border-color": "black",
            "text-valign": "center",
            "text-halign": "center",
            height: "60px",
            width: "60px",
          },
        },
        {
          selector: "node[?final]",
          style: {
            // shape: "cut-rectangle",
            "border-color": "green",
            // "border-width": 4,
            "background-image": "assets/node_inital.png",
            "background-fit": "cover",
            "border-width": 3,
            "border-opacity": 1,
          },
        },
        {
          selector: "node[?inital]",
          style: {
            // "background-fill": "radial-gradient",
            // "background-gradient-stop-colors": "yellow #666 #666",
            // "background-gradient-stop-positions": "0 20 100",
            "border-color": "yellow",
            "border-width": 4,
          },
        },
        {
          selector: "node[?inital][?final]",
          style: {
            "border-color": "#9ACD32",
            "border-width": 4,
          },
        },
        {
          selector: ":selected",
          css: {
            "background-color": "SteelBlue",
            "line-color": "black",
            "target-arrow-color": "black",
            "source-arrow-color": "black",
          },
        },
        {
          selector: "edge",
          style: {
            content: "data(label)",
            "text-wrap": "wrap",
            width: 5,
            "line-color": "#9dbaea",
            "target-arrow-color": "DarkRed",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "control-point-step-size": 50,
            "loop-sweep": 100,
          },
        },
        // some style for the extension
        {
          selector: ".eh-handle",
          style: {
            "background-color": "red",
            width: 12,
            height: 12,
            shape: "ellipse",
            "overlay-opacity": 0,
            "border-width": 12, // makes the handle easier to hit
            "border-opacity": 0,
          },
        },

        {
          selector: ".eh-hover",
          style: {
            "background-color": "red",
          },
        },

        {
          selector: ".eh-source",
          style: {
            "border-width": 2,
            "border-color": "red",
          },
        },

        {
          selector: ".eh-target",
          style: {
            "border-width": 2,
            "border-color": "red",
          },
        },

        {
          selector: ".eh-preview, .eh-ghost-edge",
          style: {
            "background-color": "red",
            "line-color": "red",
            "target-arrow-color": "red",
            "source-arrow-color": "red",
          },
        },

        {
          selector: ".eh-ghost-edge.eh-preview-active",
          style: {
            opacity: 0,
          },
        },

        {
          selector: ".highlighted",
          style: {
            "background-image": "none",
            "background-color": "red",
            "line-color": "red",
          },
        },
      ],
      elements: elements,
      layout: {
        // name: "grid",
        // name: "random",
        name: "cose",
        // name: "preset",
        // rows: 1,
      },
      wheelSensitivity: 0.3,
      // ready: function () {
      //   cy.toolbar();
      // },
      ready: (e) => {
        // console.log("what is that", e); // todo: ready function
        // this.cyinstances.push(e.cy);

        this.cy = e.cy;
        window.cyinst.push(e.cy);
      },
    });

    var a = cy.getElementById("a");
    var b = cy.getElementById("b");
    var ab = cy.getElementById("ab");

    const makeDiv = (text) => {
      var div = document.createElement("div");

      div.classList.add("popper-div");

      div.innerHTML = text;

      // document.body.appendChild(div);
      document.getElementById(this.tabId).appendChild(div);

      return div;
    };

    // TODO: fix popper, uncomment till cy.on("pan zoom resize", updateAB);
    // var popperA = a.popper({
    //   content: function () {
    //     return makeDiv("Sticky position div A");
    //   },
    // });

    // var updateA = function () {
    //   popperA.update();
    // };

    // a.on("position", updateA);
    // cy.on("pan zoom resize", updateA);

    // var popperB = b.popper({
    //   content: function () {
    //     return makeDiv("One time position div B");
    //   },
    // });

    // var popperAB = ab.popper({
    //   content: function () {
    //     return makeDiv("Sticky position div AB");
    //   },
    // });

    // var updateAB = function () {
    //   popperAB.update();
    // };

    // ab.connectedNodes().on("position", updateAB);
    // cy.on("pan zoom resize", updateAB);

    var eh = cy.edgehandles({
      canConnect: function (sourceNode, targetNode) {
        // whether an edge can be created between source and target
        // return !sourceNode.same(targetNode); // e.g. disallow loops

        return true;
      },
      edgeParams: function (sourceNode, targetNode) {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge

        return {};
      },
      hoverDelay: 150, // time spent hovering over a target node before it is considered selected
      snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
      snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
      snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
      noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
      disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
    });

    // document
    //   .querySelector("#draw-on")
    //   .addEventListener("click", function () {
    //     eh.enableDrawMode();
    //   });

    // document
    //   .querySelector("#draw-off")
    //   .addEventListener("click", function () {
    //     eh.disableDrawMode();
    //   });

    // document.querySelector("#start").addEventListener("click", function () {
    //   eh.start(cy.$("node:selected"));
    // });

    var popperEnabled = false;

    // document
    //   .querySelector("#popper")
    //   .addEventListener("click", function () {
    if (popperEnabled) {
      return;
    }

    popperEnabled = true;

    // example code for making your own handles -- customise events and presentation where fitting
    // var popper;
    var popperNode;
    var popper;
    var popperDiv;
    var started = false;

    const start = () => {
      eh.start(popperNode);
    };

    const stop = () => {
      eh.stop();
    };

    const setHandleOn = (node) => {
      if (started) {
        return;
      }

      removeHandle(); // rm old handle

      popperNode = node;

      popperDiv = document.createElement("div");
      popperDiv.classList.add("popper-handle");
      popperDiv.addEventListener("mousedown", start);
      // document.body.appendChild(popperDiv);
      document.getElementById(this.tabId).appendChild(popperDiv);

      popper = node.popper({
        content: popperDiv,
        popper: {
          placement: "top",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      });
    };

    const removeHandle = () => {
      if (popper) {
        popper.destroy();
        popper = null;
      }

      if (popperDiv) {
        // document.body.removeChild(popperDiv);
        document.getElementById(this.tabId).removeChild(popperDiv);

        popperDiv = null;
      }

      popperNode = null;
    };

    cy.on("mouseover", "node", function (e) {
      setHandleOn(e.target);
    });

    cy.on("grab", "node", function () {
      removeHandle();
    });

    cy.on("tap", function (e) {
      if (e.target === cy) {
        removeHandle();
      }
    });

    cy.on("zoom pan", function () {
      removeHandle();
    });

    cy.container().addEventListener("mouseup", function (e) {
      stop();
    });

    cy.on("ehstart", function () {
      started = true;
    });

    cy.on("ehstop", function () {
      started = false;
    });

    cy.on("ehcomplete", (event, sourceNode, targetNode, addedEdge) => {
      // let { position } = event;
      promptLabel_for_new_edge(addedEdge, this.tabType);
    });

    // Event Handlers
    setLabelEvents(cy, this.tabType);

    // Context Menu

    cy.on("cxttap", function (event) {
      if (allSelected("node")) {
        contextMenu.hideMenuItem("select-all-nodes");
        contextMenu.showMenuItem("unselect-all-nodes");
      } else {
        contextMenu.hideMenuItem("unselect-all-nodes");
        contextMenu.showMenuItem("select-all-nodes");
      }
      if (allSelected("edge")) {
        contextMenu.hideMenuItem("select-all-edges");
        contextMenu.showMenuItem("unselect-all-edges");
      } else {
        contextMenu.hideMenuItem("unselect-all-edges");
        // removed the ability to select all edges
        // contextMenu.showMenuItem("select-all-edges");
      }
    });

    var allSelected = function (type) {
      if (type == "node") {
        return cy.nodes().length == cy.nodes(":selected").length;
      } else if (type == "edge") {
        return cy.edges().length == cy.edges(":selected").length;
      }
      return false;
    };

    var selectAllOfTheSameType = function (type) {
      if (type == "node") {
        cy.nodes().select();
      } else if (type == "edge") {
        cy.edges().select();
      }
    };
    var unselectAllOfTheSameType = function (type) {
      if (type == "node") {
        cy.nodes().unselect();
      } else if (type == "edge") {
        cy.edges().unselect();
      }
    };
    var contextMenu = cy.contextMenus({
      menuItems: [
        {
          id: "setFinalState",
          content: "Final",
          tooltipText: "Toggle State as Final",
          selector: "node",
          onClickFunction: function (event) {
            var node = event.target || event.cyTarget;
            node.data({ final: !node.data().final });
          },
          hasTrailingDivider: true,
        },
        {
          id: "setInitalState",
          content: "Inital",
          tooltipText: "Toggle State as Inital",
          selector: "node",
          onClickFunction: function (event) {
            var node = event.target || event.cyTarget;
            // set all nodes to non inital
            var invertedState = !node.data().inital;
            cy.nodes().each((node) => node.data("inital", false));
            node.data({ inital: invertedState });
          },
          hasTrailingDivider: true,
        },
        {
          id: "remove",
          content: "remove",
          tooltipText: "remove",
          image: {
            src: "assets/remove.svg",
            width: 12,
            height: 12,
            x: 5,
            y: 6,
          },
          selector: "node, edge",
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            cy.container().removedEle = target.remove();

            contextMenu.showMenuItem("undo-last-remove");
          },
          hasTrailingDivider: true,
        },
        {
          id: "undo-last-remove",
          content: "undo last remove",
          selector: "node, edge",
          show: false,
          coreAsWell: true,
          onClickFunction: function (event) {
            if (cy.container().removedEle) {
              cy.container().removedEle.restore();
            }
            contextMenu.hideMenuItem("undo-last-remove");
          },
          hasTrailingDivider: true,
        },
        {
          id: "color",
          content: "change color",
          tooltipText: "change color",
          selector: "node",
          hasTrailingDivider: true,
          submenu: [
            {
              id: "color-blue",
              content: "blue",
              tooltipText: "blue",
              onClickFunction: function (event) {
                let target = event.target || event.cyTarget;
                target.style("background-color", "blue");
              },
              submenu: [
                {
                  id: "color-light-blue",
                  content: "light blue",
                  tooltipText: "light blue",
                  onClickFunction: function (event) {
                    let target = event.target || event.cyTarget;
                    target.style("background-color", "lightblue");
                  },
                },
                {
                  id: "color-dark-blue",
                  content: "dark blue",
                  tooltipText: "dark blue",
                  onClickFunction: function (event) {
                    let target = event.target || event.cyTarget;
                    target.style("background-color", "darkblue");
                  },
                },
              ],
            },
            {
              id: "color-green",
              content: "green",
              tooltipText: "green",
              onClickFunction: function (event) {
                let target = event.target || event.cyTarget;
                target.style("background-color", "green");
              },
            },
            {
              id: "color-red",
              content: "red",
              tooltipText: "red",
              onClickFunction: function (event) {
                let target = event.target || event.cyTarget;
                target.style("background-color", "red");
              },
            },
          ],
        },
        {
          id: "add-node",
          content: "add node",
          tooltipText: "add node",
          image: { src: "assets/add.svg", width: 12, height: 12, x: 5, y: 6 },
          coreAsWell: true,
          onClickFunction: function (event) {
            const nodesCount = cy.nodes().length;
            const nodeName = "q" + nodesCount;
            var data = {
              group: "nodes",
              id: nodeName,
              label: nodeName,
              inital: false,
              final: false,
            };

            var pos = event.position || event.cyPosition;

            cy.add({
              data: data,
              position: {
                x: pos.x,
                y: pos.y,
              },
            });
          },
        },
        {
          id: "select-all-nodes",
          content: "select all nodes",
          selector: "node",
          coreAsWell: true,
          show: true,
          onClickFunction: function (event) {
            selectAllOfTheSameType("node");

            contextMenu.hideMenuItem("select-all-nodes");
            contextMenu.showMenuItem("unselect-all-nodes");
          },
        },
        {
          id: "unselect-all-nodes",
          content: "unselect all nodes",
          selector: "node",
          coreAsWell: true,
          show: false,
          onClickFunction: function (event) {
            unselectAllOfTheSameType("node");

            contextMenu.showMenuItem("select-all-nodes");
            contextMenu.hideMenuItem("unselect-all-nodes");
          },
        },
        {
          id: "select-all-edges",
          content: "select all edges",
          selector: "edge",
          coreAsWell: true,
          show: false,
          onClickFunction: function (event) {
            selectAllOfTheSameType("edge");

            contextMenu.hideMenuItem("select-all-edges");
            contextMenu.showMenuItem("unselect-all-edges");
          },
        },
        {
          id: "unselect-all-edges",
          content: "unselect all edges",
          selector: "edge",
          coreAsWell: true,
          show: false,
          onClickFunction: function (event) {
            unselectAllOfTheSameType("edge");

            contextMenu.showMenuItem("select-all-edges");
            contextMenu.hideMenuItem("unselect-all-edges");
          },
        },

        {
          id: "fit",
          content: "Fit Graph",
          tooltipText: "Fit Graph",
          coreAsWell: true,
          onClickFunction: function (event) {
            cy.fit();
          },
          hasTrailingDivider: true,
        },
      ],
    });

    // Edge Bending

    // cy.edgeEditing({
    //   undoable: false,
    //   bendRemovalSensitivity: 16,
    //   enableMultipleAnchorRemovalOption: true,
    //   initAnchorsAutomatically: false,
    //   useTrailingDividersAfterContextMenuOptions: false,
    //   enableCreateAnchorOnDrag: true,
    // });

    // cy.edgeEditing({
    //   // this function specifies the positions of bend points
    //   // strictly name the property 'bendPointPositions' for the edge to be detected for bend point edititng
    //   bendPositionsFunction: function (ele) {
    //     return ele.data("bendPointPositions");
    //   },
    //   // this function specifies the poitions of control points
    //   // strictly name the property 'controlPointPositions' for the edge to be detected for control point edititng
    //   controlPositionsFunction: function (ele) {
    //     return ele.data("controlPointPositions");
    //   },
    //   // whether to initilize bend and control points on creation of this extension automatically
    //   initAnchorsAutomatically: true,
    //   // the classes of those edges that should be ignored
    //   ignoredClasses: [],
    //   // whether the bend editing operations are undoable (requires cytoscape-undo-redo.js)
    //   undoable: false,
    //   // the size of bend and control point shape is obtained by multipling width of edge with this parameter
    //   anchorShapeSizeFactor: 3,
    //   // z-index value of the canvas in which bend points are drawn
    //   zIndex: 999,
    //   // whether to start the plugin in the enabled state
    //   enabled: true,
    //   /*An option that controls the distance (in pixels) within which a bend point is considered near the line segment between
    //      its two neighbors and will be automatically removed
    //      min value = 0 , max value = 20 , values less than 0 are set to 0 and values greater than 20 are set to 20
    //    */
    //   bendRemovalSensitivity: 8,
    //   // title of add bend point menu item (User may need to adjust width of menu items according to length of this option)
    //   addBendMenuItemTitle: "Add Bend Point",
    //   // title of remove bend point menu item (User may need to adjust width of menu items according to length of this option)
    //   removeBendMenuItemTitle: "Remove Bend Point",
    //   // title of remove all bend points menu item
    //   removeAllBendMenuItemTitle: "Remove All Bend Points",
    //   // title of add control point menu item (User may need to adjust width of menu items according to length of this option)
    //   addControlMenuItemTitle: "Add Control Point",
    //   // title of remove control point menu item (User may need to adjust width of menu items according to length of this option)
    //   removeControlMenuItemTitle: "Remove Control Point",
    //   // title of remove all control points menu item
    //   removeAllControlMenuItemTitle: "Remove All Control Points",
    //   // whether 'Remove all bend points' and 'Remove all control points' options should be presented to the user
    //   enableMultipleAnchorRemovalOption: false,
    //   // whether the bend and control points can be moved by arrows
    //   moveSelectedAnchorsOnKeyEvents: function () {
    //     return true;
    //   },
    //   // this function handles reconnection of the edge, if undefined simply connect edge to its new source/target
    //   // handleReconnectEdge (newSource.id(), newTarget.id(), edge.data())
    //   handleReconnectEdge: undefined,
    //   // this function checks validation of the edge and its new source/target
    //   validateEdge: function (edge, newSource, newTarget) {
    //     return "valid";
    //   },
    //   // this function is called if reconnected edge is not valid according to validateEdge function
    //   actOnUnsuccessfulReconnection: undefined,
    // });
    // cy.style().update();

    const handleWindowResize = () => {
      cy.fit();
      console.log("[event] resize");
    };

    cy.on("resize", handleWindowResize);
  }

  injectCyForConversion(cyId, elements) {
    // TODO: FIX THIS injectCYForConversion
    elements.edges?.forEach((edge) => {
      edge.data = {
        ...edge.data,
        ...parseExampleLabels(edge.data.label, this.tabType),
      };
    });

    if (!window.cyinst) window.cyinst = [];
    var cy = cytoscape({
      container: document.getElementById(cyId),
      style: [
        {
          selector: "node",
          style: {
            content: "data(id)",
            "background-color": "#666",
            "foreground-color": "white",
            "border-width": 2,
            "border-style": "solid",
            "border-color": "black",
            "text-valign": "center",
            "text-halign": "center",
            color: "white",
            height: "60px",
            width: "60px",
          },
        },
        {
          selector: "node[name]",
          style: {
            "background-color": "#666",
            content: "data(name)",
            "border-width": 2,
            "border-style": "solid",
            "border-color": "black",
            "text-valign": "center",
            "text-halign": "center",
            height: "60px",
            width: "60px",
          },
        },
        {
          selector: "node[?final]",
          style: {
            // shape: "cut-rectangle",
            "border-color": "green",
            // "border-width": 4,
            "background-image": "assets/node_inital.png",
            "background-fit": "cover",
            "border-width": 3,
            "border-opacity": 1,
          },
        },
        {
          selector: "node[?inital]",
          style: {
            // "background-fill": "radial-gradient",
            // "background-gradient-stop-colors": "yellow #666 #666",
            // "background-gradient-stop-positions": "0 20 100",
            "border-color": "yellow",
            "border-width": 4,
          },
        },
        {
          selector: "node[?inital][?final]",
          style: {
            "border-color": "#9ACD32",
            "border-width": 4,
          },
        },
        {
          selector: ":selected",
          css: {
            "background-color": "SteelBlue",
            "line-color": "black",
            "target-arrow-color": "black",
            "source-arrow-color": "black",
          },
        },
        {
          selector: "edge",
          style: {
            content: "data(label)",
            "text-wrap": "wrap",
            width: 5,
            "line-color": "#9dbaea",
            "target-arrow-color": "DarkRed",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "control-point-step-size": 50,
            "loop-sweep": 100,
          },
        },
        // some style for the extension
        {
          selector: ".eh-handle",
          style: {
            "background-color": "red",
            width: 12,
            height: 12,
            shape: "ellipse",
            "overlay-opacity": 0,
            "border-width": 12, // makes the handle easier to hit
            "border-opacity": 0,
          },
        },

        {
          selector: ".eh-hover",
          style: {
            "background-color": "red",
          },
        },

        {
          selector: ".eh-source",
          style: {
            "border-width": 2,
            "border-color": "red",
          },
        },

        {
          selector: ".eh-target",
          style: {
            "border-width": 2,
            "border-color": "red",
          },
        },

        {
          selector: ".eh-preview, .eh-ghost-edge",
          style: {
            "background-color": "red",
            "line-color": "red",
            "target-arrow-color": "red",
            "source-arrow-color": "red",
          },
        },

        {
          selector: ".eh-ghost-edge.eh-preview-active",
          style: {
            opacity: 0,
          },
        },

        {
          selector: ".highlighted",
          style: {
            "background-image": "none",
            "background-color": "red",
            "line-color": "red",
          },
        },
      ],
      elements: elements,
      layout: {
        // name: "grid",
        // name: "random",
        name: "cose",
        // name: "preset",
        // rows: 1,
      },
      wheelSensitivity: 0.3,
      // ready: function () {
      //   cy.toolbar();
      // },
      ready: (e) => {
        // console.log("what is that", e); // todo: ready function
        // this.cyinstances.push(e.cy);

        window.cyinst.push(e.cy);
      },
    });

    var a = cy.getElementById("a");
    var b = cy.getElementById("b");
    var ab = cy.getElementById("ab");

    const makeDiv = (text) => {
      var div = document.createElement("div");

      div.classList.add("popper-div");

      div.innerHTML = text;

      // document.body.appendChild(div);
      document.getElementById(this.tabId).appendChild(div);

      return div;
    };

    // TODO: fix popper, uncomment till cy.on("pan zoom resize", updateAB);
    // var popperA = a.popper({
    //   content: function () {
    //     return makeDiv("Sticky position div A");
    //   },
    // });

    // var updateA = function () {
    //   popperA.update();
    // };

    // a.on("position", updateA);
    // cy.on("pan zoom resize", updateA);

    // var popperB = b.popper({
    //   content: function () {
    //     return makeDiv("One time position div B");
    //   },
    // });

    // var popperAB = ab.popper({
    //   content: function () {
    //     return makeDiv("Sticky position div AB");
    //   },
    // });

    // var updateAB = function () {
    //   popperAB.update();
    // };

    // ab.connectedNodes().on("position", updateAB);
    // cy.on("pan zoom resize", updateAB);

    var eh = cy.edgehandles({
      canConnect: function (sourceNode, targetNode) {
        // whether an edge can be created between source and target
        // return !sourceNode.same(targetNode); // e.g. disallow loops

        return true;
      },
      edgeParams: function (sourceNode, targetNode) {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge

        return {};
      },
      hoverDelay: 150, // time spent hovering over a target node before it is considered selected
      snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
      snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
      snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
      noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
      disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
    });

    // document
    //   .querySelector("#draw-on")
    //   .addEventListener("click", function () {
    //     eh.enableDrawMode();
    //   });

    // document
    //   .querySelector("#draw-off")
    //   .addEventListener("click", function () {
    //     eh.disableDrawMode();
    //   });

    // document.querySelector("#start").addEventListener("click", function () {
    //   eh.start(cy.$("node:selected"));
    // });

    var popperEnabled = false;

    // document
    //   .querySelector("#popper")
    //   .addEventListener("click", function () {
    if (popperEnabled) {
      return;
    }

    popperEnabled = true;

    // example code for making your own handles -- customise events and presentation where fitting
    // var popper;
    var popperNode;
    var popper;
    var popperDiv;
    var started = false;

    const start = () => {
      eh.start(popperNode);
    };

    const stop = () => {
      eh.stop();
    };

    const setHandleOn = (node) => {
      if (started) {
        return;
      }

      removeHandle(); // rm old handle

      popperNode = node;

      popperDiv = document.createElement("div");
      popperDiv.classList.add("popper-handle");
      popperDiv.addEventListener("mousedown", start);
      // document.body.appendChild(popperDiv);
      document.getElementById(this.tabId).appendChild(popperDiv);

      popper = node.popper({
        content: popperDiv,
        popper: {
          placement: "top",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      });
    };

    const removeHandle = () => {
      if (popper) {
        popper.destroy();
        popper = null;
      }

      if (popperDiv) {
        // document.body.removeChild(popperDiv);
        document.getElementById(this.tabId).removeChild(popperDiv);

        popperDiv = null;
      }

      popperNode = null;
    };

    cy.on("mouseover", "node", function (e) {
      setHandleOn(e.target);
    });

    cy.on("grab", "node", function () {
      removeHandle();
    });

    cy.on("tap", function (e) {
      if (e.target === cy) {
        removeHandle();
      }
    });

    cy.on("zoom pan", function () {
      removeHandle();
    });

    cy.container().addEventListener("mouseup", function (e) {
      stop();
    });

    cy.on("ehstart", function () {
      started = true;
    });

    cy.on("ehstop", function () {
      started = false;
    });

    cy.on("ehcomplete", (event, sourceNode, targetNode, addedEdge) => {
      // let { position } = event;
      promptLabel_for_new_edge(addedEdge, this.tabType);
    });

    // Event Handlers
    setLabelEvents(cy, this.tabType);

    // Context Menu

    cy.on("cxttap", function (event) {
      if (allSelected("node")) {
        contextMenu.hideMenuItem("select-all-nodes");
        contextMenu.showMenuItem("unselect-all-nodes");
      } else {
        contextMenu.hideMenuItem("unselect-all-nodes");
        contextMenu.showMenuItem("select-all-nodes");
      }
      if (allSelected("edge")) {
        contextMenu.hideMenuItem("select-all-edges");
        contextMenu.showMenuItem("unselect-all-edges");
      } else {
        contextMenu.hideMenuItem("unselect-all-edges");
        // removed the ability to select all edges
        // contextMenu.showMenuItem("select-all-edges");
      }
    });

    var allSelected = function (type) {
      if (type == "node") {
        return cy.nodes().length == cy.nodes(":selected").length;
      } else if (type == "edge") {
        return cy.edges().length == cy.edges(":selected").length;
      }
      return false;
    };

    var selectAllOfTheSameType = function (type) {
      if (type == "node") {
        cy.nodes().select();
      } else if (type == "edge") {
        cy.edges().select();
      }
    };
    var unselectAllOfTheSameType = function (type) {
      if (type == "node") {
        cy.nodes().unselect();
      } else if (type == "edge") {
        cy.edges().unselect();
      }
    };
    var contextMenu = cy.contextMenus({
      menuItems: [
        {
          id: "setFinalState",
          content: "Final",
          tooltipText: "Toggle State as Final",
          selector: "node",
          onClickFunction: function (event) {
            var node = event.target || event.cyTarget;
            node.data({ final: !node.data().final });
          },
          hasTrailingDivider: true,
        },
        {
          id: "setInitalState",
          content: "Inital",
          tooltipText: "Toggle State as Inital",
          selector: "node",
          onClickFunction: function (event) {
            var node = event.target || event.cyTarget;
            // set all nodes to non inital
            var invertedState = !node.data().inital;
            cy.nodes().each((node) => node.data("inital", false));
            node.data({ inital: invertedState });
          },
          hasTrailingDivider: true,
        },
        {
          id: "remove",
          content: "remove",
          tooltipText: "remove",
          image: {
            src: "assets/remove.svg",
            width: 12,
            height: 12,
            x: 5,
            y: 6,
          },
          selector: "node, edge",
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            cy.container().removedEle = target.remove();

            contextMenu.showMenuItem("undo-last-remove");
          },
          hasTrailingDivider: true,
        },
        {
          id: "undo-last-remove",
          content: "undo last remove",
          selector: "node, edge",
          show: false,
          coreAsWell: true,
          onClickFunction: function (event) {
            if (cy.container().removedEle) {
              cy.container().removedEle.restore();
            }
            contextMenu.hideMenuItem("undo-last-remove");
          },
          hasTrailingDivider: true,
        },
        {
          id: "color",
          content: "change color",
          tooltipText: "change color",
          selector: "node",
          hasTrailingDivider: true,
          submenu: [
            {
              id: "color-blue",
              content: "blue",
              tooltipText: "blue",
              onClickFunction: function (event) {
                let target = event.target || event.cyTarget;
                target.style("background-color", "blue");
              },
              submenu: [
                {
                  id: "color-light-blue",
                  content: "light blue",
                  tooltipText: "light blue",
                  onClickFunction: function (event) {
                    let target = event.target || event.cyTarget;
                    target.style("background-color", "lightblue");
                  },
                },
                {
                  id: "color-dark-blue",
                  content: "dark blue",
                  tooltipText: "dark blue",
                  onClickFunction: function (event) {
                    let target = event.target || event.cyTarget;
                    target.style("background-color", "darkblue");
                  },
                },
              ],
            },
            {
              id: "color-green",
              content: "green",
              tooltipText: "green",
              onClickFunction: function (event) {
                let target = event.target || event.cyTarget;
                target.style("background-color", "green");
              },
            },
            {
              id: "color-red",
              content: "red",
              tooltipText: "red",
              onClickFunction: function (event) {
                let target = event.target || event.cyTarget;
                target.style("background-color", "red");
              },
            },
          ],
        },
        {
          id: "add-node",
          content: "add node",
          tooltipText: "add node",
          image: { src: "assets/add.svg", width: 12, height: 12, x: 5, y: 6 },
          coreAsWell: true,
          onClickFunction: function (event) {
            const nodesCount = cy.nodes().length;
            const nodeName = "q" + nodesCount;
            var data = {
              group: "nodes",
              id: nodeName,
              label: nodeName,
              inital: false,
              final: false,
            };

            var pos = event.position || event.cyPosition;

            cy.add({
              data: data,
              position: {
                x: pos.x,
                y: pos.y,
              },
            });
          },
        },
        {
          id: "select-all-nodes",
          content: "select all nodes",
          selector: "node",
          coreAsWell: true,
          show: true,
          onClickFunction: function (event) {
            selectAllOfTheSameType("node");

            contextMenu.hideMenuItem("select-all-nodes");
            contextMenu.showMenuItem("unselect-all-nodes");
          },
        },
        {
          id: "unselect-all-nodes",
          content: "unselect all nodes",
          selector: "node",
          coreAsWell: true,
          show: false,
          onClickFunction: function (event) {
            unselectAllOfTheSameType("node");

            contextMenu.showMenuItem("select-all-nodes");
            contextMenu.hideMenuItem("unselect-all-nodes");
          },
        },
        {
          id: "select-all-edges",
          content: "select all edges",
          selector: "edge",
          coreAsWell: true,
          show: false,
          onClickFunction: function (event) {
            selectAllOfTheSameType("edge");

            contextMenu.hideMenuItem("select-all-edges");
            contextMenu.showMenuItem("unselect-all-edges");
          },
        },
        {
          id: "unselect-all-edges",
          content: "unselect all edges",
          selector: "edge",
          coreAsWell: true,
          show: false,
          onClickFunction: function (event) {
            unselectAllOfTheSameType("edge");

            contextMenu.showMenuItem("select-all-edges");
            contextMenu.hideMenuItem("unselect-all-edges");
          },
        },

        {
          id: "fit",
          content: "Fit Graph",
          tooltipText: "Fit Graph",
          coreAsWell: true,
          onClickFunction: function (event) {
            cy.fit();
          },
          hasTrailingDivider: true,
        },
      ],
    });

    // Edge Bending

    // cy.edgeEditing({
    //   undoable: false,
    //   bendRemovalSensitivity: 16,
    //   enableMultipleAnchorRemovalOption: true,
    //   initAnchorsAutomatically: false,
    //   useTrailingDividersAfterContextMenuOptions: false,
    //   enableCreateAnchorOnDrag: true,
    // });

    // cy.edgeEditing({
    //   // this function specifies the positions of bend points
    //   // strictly name the property 'bendPointPositions' for the edge to be detected for bend point edititng
    //   bendPositionsFunction: function (ele) {
    //     return ele.data("bendPointPositions");
    //   },
    //   // this function specifies the poitions of control points
    //   // strictly name the property 'controlPointPositions' for the edge to be detected for control point edititng
    //   controlPositionsFunction: function (ele) {
    //     return ele.data("controlPointPositions");
    //   },
    //   // whether to initilize bend and control points on creation of this extension automatically
    //   initAnchorsAutomatically: true,
    //   // the classes of those edges that should be ignored
    //   ignoredClasses: [],
    //   // whether the bend editing operations are undoable (requires cytoscape-undo-redo.js)
    //   undoable: false,
    //   // the size of bend and control point shape is obtained by multipling width of edge with this parameter
    //   anchorShapeSizeFactor: 3,
    //   // z-index value of the canvas in which bend points are drawn
    //   zIndex: 999,
    //   // whether to start the plugin in the enabled state
    //   enabled: true,
    //   /*An option that controls the distance (in pixels) within which a bend point is considered near the line segment between
    //      its two neighbors and will be automatically removed
    //      min value = 0 , max value = 20 , values less than 0 are set to 0 and values greater than 20 are set to 20
    //    */
    //   bendRemovalSensitivity: 8,
    //   // title of add bend point menu item (User may need to adjust width of menu items according to length of this option)
    //   addBendMenuItemTitle: "Add Bend Point",
    //   // title of remove bend point menu item (User may need to adjust width of menu items according to length of this option)
    //   removeBendMenuItemTitle: "Remove Bend Point",
    //   // title of remove all bend points menu item
    //   removeAllBendMenuItemTitle: "Remove All Bend Points",
    //   // title of add control point menu item (User may need to adjust width of menu items according to length of this option)
    //   addControlMenuItemTitle: "Add Control Point",
    //   // title of remove control point menu item (User may need to adjust width of menu items according to length of this option)
    //   removeControlMenuItemTitle: "Remove Control Point",
    //   // title of remove all control points menu item
    //   removeAllControlMenuItemTitle: "Remove All Control Points",
    //   // whether 'Remove all bend points' and 'Remove all control points' options should be presented to the user
    //   enableMultipleAnchorRemovalOption: false,
    //   // whether the bend and control points can be moved by arrows
    //   moveSelectedAnchorsOnKeyEvents: function () {
    //     return true;
    //   },
    //   // this function handles reconnection of the edge, if undefined simply connect edge to its new source/target
    //   // handleReconnectEdge (newSource.id(), newTarget.id(), edge.data())
    //   handleReconnectEdge: undefined,
    //   // this function checks validation of the edge and its new source/target
    //   validateEdge: function (edge, newSource, newTarget) {
    //     return "valid";
    //   },
    //   // this function is called if reconnected edge is not valid according to validateEdge function
    //   actOnUnsuccessfulReconnection: undefined,
    // });
    // cy.style().update();

    const handleWindowResize = () => {
      cy.fit();
      console.log("[event] resize");
    };

    cy.on("resize", handleWindowResize);

    return cy;
  }

  createHeadlessCy() {
    // NOTE: either calling this method or the injectCy, input by formal definition calls this
    // . Also note that cy.destroy() must be called to clean up a style-enabled, headless instance.
    const cy = cytoscape({ headless: true, styleEnabled: false });
    if (!window.cyinst) window.cyinst = [cy];
    else window.cyinst.push(cy);
    return cy;
    /**
     * cyinst[0].add({group:'nodes', data: { id: "q0", name: "q0", inital:true, final: false }})
     * cyinst[0].add({group:'nodes', data: { id: "q1", name: "q1", inital:false, final: true }})
     * cyinst[0].add({group:'edges', data: { id: "q0q1", source: "q0", target: "q1", label: "c" }})
     */
  }
  getCy() {
    return this.cy;
  }
  getConfigs() {
    return this.sim.getConfigs();
  }
}
