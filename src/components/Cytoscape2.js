/* eslint-disable no-undef */

import React, { useEffect, useState, useRef } from "react";
import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import edgehandles from "cytoscape-edgehandles";

cytoscape.use(popper);
cytoscape.use(edgehandles);

const Cytoscape2 = (props) => {
  console.count("render");
  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;

  const [, forceRerender] = useState();

  const cyRef = useRef();

  const handleMouseClick = (event) => {
    // target holds a reference to the originator
    // of the event (core or element)
    var evtTarget = event.target;
    if (evtTarget === cy) {
      console.log("tap on background 1");
      console.log("enable  adding", props.tbEnableAdding);
      if (!props.tbEnableAdding) return;
      console.log("adding new node");
      cy.add({
        data: { id: "n" + cy.nodes().length },
        position: { x: event.position.x, y: event.position.y },
      });
    } else {
      console.log("tap on some element");
      if (!props.tbEnableDeleting) return;
      cy.remove(evtTarget);
    }
  };

  useEffect(() => {
    window.cy = cytoscape({
      container: cyRef.current,
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
            data: { id: "a", name: "Node A" },
            position: { x: 0, y: 0 },
            selected: true,
            locked: false,
          },
          {
            data: { id: "b" },
            parent: "a",
            renderedPosition: { x: 0, y: 0 },
            selected: true,
          },
          { data: { id: "c" }, parent: "a" },
          { data: { id: "d" } },
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
    });

    var a = cy.getElementById("a");
    var b = cy.getElementById("b");
    var ab = cy.getElementById("ab");

    var makeDiv = function (text) {
      var div = document.createElement("div");

      div.classList.add("popper-div");

      div.innerHTML = text;

      // TODO
      // document.body.appendChild(div);
      // console.log(props);
      document.getElementById(`tab-${props.tabId}`).appendChild(div);

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

    var eh = (window.eh = cy.edgehandles({
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
    }));

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

    function start() {
      eh.start(popperNode);
    }

    function stop() {
      eh.stop();
    }

    function setHandleOn(node) {
      if (started) {
        return;
      }

      removeHandle(); // rm old handle

      popperNode = node;

      popperDiv = document.createElement("div");
      popperDiv.classList.add("popper-handle");
      popperDiv.addEventListener("mousedown", start);
      // TODO
      // document.body.appendChild(popperDiv);
      document.getElementById("tab-1").appendChild(popperDiv);

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
    }

    function removeHandle() {
      if (popper) {
        popper.destroy();
        popper = null;
      }

      if (popperDiv) {
        // TODO
        // document.body.removeChild(popperDiv);
        document.getElementById("tab-1").removeChild(popperDiv);
        popperDiv = null;
      }

      popperNode = null;
    }

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

    window.addEventListener("mouseup", function (e) {
      stop();
    });

    cy.on("ehstart", function () {
      started = true;
    });

    cy.on("ehstop", function () {
      started = false;
    });

    // Event Handles
    cy.on("tap", handleMouseClick);
    cy.on("ehcomplete", (event, sourceNode, targetNode, addedEdge) => {
      let { position } = event;
      const transitionLabel = prompt("Enter transition label");
      if (transitionLabel == null) {
        addedEdge.remove();
        return;
      }
      addedEdge.data("label", transitionLabel || "ε");
    });
  }, [handleMouseClick]);

  return (
    <>
      <>
        <div id="cy" ref={cyRef} />
        <div id="buttons">
          <button
            onClick={() => {
              this.cy.$("#a").data({ name: "Node K" });
            }}
          >
            change A to K
          </button>
          {/* <button id="start">Start on selected</button> */}
          {/* <button id="draw-on">Draw mode on</button> */}
          {/* <button id="draw-off">Draw mode off</button> */}
          {/* <button id="popper">Use custom popper handles</button> */}

          <button
            onClick={() => {
              console.log("click cy.fit");
              cy.fit();
            }}
          >
            fit to screen
          </button>
        </div>
        <h1>Renders: {renderCounter.current}</h1>
        <button
          onClick={() => {
            forceRerender({});
          }}
        >
          Rerender
        </button>
      </>
    </>
  );
};

const cmp = React.memo(Cytoscape2, areEqual);
// const Ifchange = React.memo(Cytoscape2);

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  True => don't rerender if same props
  False => rerender if props changed
  */
  console.log("nextProps", nextProps);
  // prevProps = nextProps || {};
  console.dir(cmp);
  console.dir(cmp.type);
  console.dir(Cytoscape2);
  // cmp.props = nextProps;
  return true;
}
export default cmp;
