import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import edgehandles from "cytoscape-edgehandles";
import contextMenus from "cytoscape-context-menus";

class Main {
  constructor() {
    this.saved = "SAVED!";
    this.tbEnableAdding = false;
    this.tbEnableDeleting = false;
    this.curInstanceNum = undefined; //todo
    this.cyinstances = [];
  }

  sayhi() {
    console.log("Main says hi!1");
  }
  #getCyId(tabNum) {
    return "cy-" + tabNum;
  }
  #getTabId(tabNum) {
    return "tab-" + tabNum;
  }
  #getCurrentInstance() {
    return this.cyinstances[this.curInstanceNum];
  }
  #activateTab(tabNum) {
    var $ = window.jQuery;
    $("#tabs").tabs({ active: tabNum });
  }
  jqueryExtentions() {
    var $ = window.jQuery;
    // for more see: https://www.javatpoint.com/jquery-ui-tabs
    // jQuery extentions
    $.fn.tabCount = function () {
      return $(this).find("ul").children().length;
    };
    $.fn.addTab = function (name) {
      var id = this.tabCount();
      $("ul", this).append(
        '<li><a href="#tab-' + id + '">' + name + "</a></li>"
      );
      $(this).append("<div id='tab-" + id + "'></div>");
      $(this).tabs("refresh");
    };
    $.fn.removeTab = function (index) {
      $("ul li:eq(" + index + ")", this).remove();
      $("div:eq(" + index + ")", this).remove();
      $(this).tabs("refresh");
    };
  }
  initialize() {
    console.log("Initialzing Maing");
    var $ = window.jQuery;
    window.instances = this.cyinstances;
    this.jqueryExtentions();
    $("#tabs").tabs();
    $("#tabs").tabs({ active: 1 });

    // $(document).ready(() => {
    console.log("Document is ready now ");

    this.addTab();
    this.addTab();
    this.addTab();
    // });
  }

  addTab() {
    const tabNum = (this.curInstanceNum = this.curInstanceNum + 1 || 0); //todo
    this.#activateTab(tabNum);

    console.log("current Instance Num: " + this.curInstanceNum);

    var cy = cytoscape({
      container: document.getElementById(this.#getCyId(tabNum)),
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
            "border-width": 4,
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
            width: 5,
            "line-color": "#9dbaea",
            "target-arrow-color": "DarkRed",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
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
      ],
      elements: {
        nodes: [
          {
            data: { id: "a", name: "Node A", inital: true, final: false },
            position: { x: 0, y: 0 },
            selected: true,
            locked: false,
          },
          {
            data: { id: "b", name: "B", inital: false, final: true },
            parent: "a",
            renderedPosition: { x: 0, y: 0 },
          },
          {
            data: { id: "c", name: "C", inital: false, final: false },
            parent: "a",
          },
          { data: { id: "d", name: "D", inital: false, final: true } },
        ],
        edges: [
          // { data: { id: "aa", source: "a", target: "a" } },
          { data: { id: "ab", source: "a", target: "b" } },
          { data: { id: "ba", source: "b", target: "a" } },
          { data: { id: "ac", source: "a", target: "c" } },
          { data: { id: "cd", source: "c", target: "d", label: "ABCD" } },
        ],
      },
      layout: {
        name: "grid",
        // name: "preset",
        // rows: 1,
      },
      // ready: function () {
      //   cy.toolbar();
      // },
      ready: (e) => {
        // console.log("what is that", e);
        this.cyinstances.push(e.cy);
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
      document.getElementById(this.#getTabId(tabNum)).appendChild(div);

      return div;
    };

    var popperA = a.popper({
      content: function () {
        return makeDiv("Sticky position div A");
      },
    });

    var updateA = function () {
      popperA.update();
    };

    a.on("position", updateA);
    cy.on("pan zoom resize", updateA);

    var popperB = b.popper({
      content: function () {
        return makeDiv("One time position div B");
      },
    });

    var popperAB = ab.popper({
      content: function () {
        return makeDiv("Sticky position div AB");
      },
    });

    var updateAB = function () {
      popperAB.update();
    };

    ab.connectedNodes().on("position", updateAB);
    cy.on("pan zoom resize", updateAB);

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
      document.getElementById(this.#getTabId(tabNum)).appendChild(popperDiv);

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
        document.getElementById(this.#getTabId(tabNum)).removeChild(popperDiv);

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

    // Event Handlers
    cy.on("ehcomplete", (event, sourceNode, targetNode, addedEdge) => {
      let { position } = event;
      const transitionLabel = prompt("Enter transition label");
      if (transitionLabel == null) {
        addedEdge.remove();
        return;
      }
      addedEdge.data("label", transitionLabel || "ε");
    });

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
        contextMenu.showMenuItem("select-all-edges");
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
            var data = {
              group: "nodes",
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
          show: true,
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
      ],
    });

    cy.on("tap", this.handleMouseClick);
  }

  handleMouseClick = (event) => {
    // target holds a reference to the originator
    // of the event (core or element)
    var evtTarget = event.target;
    // console.log("evtTarget", evtTarget);
    // var cy = window.cy;
    var cy = this.#getCurrentInstance();
    if (evtTarget === cy) {
      console.log("tap on background 1");
      // console.log("props inside tapp on bg", props);
      // console.log("enable  adding", props.tbEnableAdding);
      if (!this.tbEnableAdding) return;
      console.log("adding new node");
      cy.add({
        data: { id: "n" + cy.nodes().length },
        position: { x: event.position.x, y: event.position.y },
      });
    } else {
      console.log("tap on some element");
      if (!this.tbEnableDeleting) return;
      cy.remove(evtTarget);
    }
  };
}

export default Main;
