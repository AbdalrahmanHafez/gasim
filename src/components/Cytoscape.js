/* eslint-disable no-undef */
import React, { Component } from "react";

export default class Cytoscape extends Component {
  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // evnthouh it will not rerender, a change in props will call this function
    console.log("next props: ", nextProps);
    this.cy.$("#a").data({ name: nextProps.value });
  }

  // cy.$("#a").data({name:'ahmed'})
  componentDidMount() {
    this.cy = window.cy = cytoscape({
      container: this.refs.cy,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#666",
            content: "data(id)",
            "border-width": 2,
            "border-style": "solid",
            "border-color": "yellow",
            "text-valign": "center",
            "text-halign": "center",
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
            "border-color": "yellow",
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
            width: 3,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
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
            data: { id: "a", name: this.props.value },
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
          { data: { id: "ab", source: "a", target: "b" } },
          { data: { id: "ba", source: "b", target: "a" } },
          { data: { id: "ac", source: "a", target: "c" } },
          { data: { id: "cd", source: "c", target: "d" } },
        ],
      },
      layout: {
        name: "grid",
        // name: "preset",
        // rows: 1,
      },
    });
  }
  render() {
    return <div id="cy" ref="cy" />;
  }
}
