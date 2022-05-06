import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import edgehandles from "cytoscape-edgehandles";
import contextMenus from "cytoscape-context-menus";
import tabTypes from "../enums/tabTypes";

cytoscape.use(edgehandles);
cytoscape.use(contextMenus);
cytoscape.use(popper);
// cytoscape.use(edgeEditing);
// edgeEditing(cytoscape, $, konva); // register extension

export const injectEmptyCy = (cyId) => {
  //   elements.edges?.forEach((edge) => {
  //     edge.data = {
  //       ...edge.data,
  //       ...parseExampleLabels(edge.data.label, this.tabType),
  //     };
  //   });

  const cyDiv = document.getElementById(cyId);
  //   const popperParent = cyDiv.closest("div");
  const popperParent = cyDiv;

  var cy = cytoscape({
    container: cyDiv,
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
      // console.log("what is that", e);
      // this.cyinstances.push(e.cy);
      // this.cy = e.cy;

      if (!window.cyinst) window.cyinst = [];
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
    // document.getElementById(this.tabId).appendChild(div);
    popperParent.appendChild(div);

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
    // document.getElementById(this.tabId).appendChild(popperDiv);
    popperParent.appendChild(popperDiv);

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
      //   document.getElementById(this.tabId).removeChild(popperDiv);
      popperParent.removeChild(popperDiv);

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
    // TODO:
    // promptLabel_for_new_edge(addedEdge, this.tabType);
  });

  // Event Handlers
  //   setLabelEvents(cy, this.tabType);
  //   TODO:

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
};

export const addElementsToCy = (cy, elements) => {
  cy.add(elements);
};

export const getNodeFromId = (cy, id) => cy.$("#" + id)[0];

export const clearHighlighted = (cy) => {
  // TODO: lookat cy.batch()
  cy.$("node, edge")
    .toArray()
    .forEach((n) => n.removeClass("highlighted"));
};

export const highlightConfigs = (cy, configs) => {
  clearHighlighted(cy);
  configs.forEach((config) => {
    getNodeFromId(cy, config.stateId).addClass("highlighted");
    config.takenEdges?.forEach((edge) => edge.addClass("highlighted"));
  });
};

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

export const verifyOnlyOneFinalState = (cyinst) => {
  const finalNodes = cyinst.$("node[?final]");
  if (!verifyAtLeastFinalState(cyinst) || finalNodes.length !== 1) {
    alert("Graph must contain at only one final state");
    return false;
  }
  return true;
};