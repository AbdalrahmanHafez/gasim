import React from "react";
import ReactDOM from "react-dom";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { REtoNFA } from ".";
import { REModel, REView } from "../RE";

it("convert ab*c", () => {
  const model = new REModel("ab*c");
  const updateModel = (newText) => new REModel(newText);
  const content = <REView model={model} updateModel={updateModel} />;
  // ReactDOM.render(, div);
  render(content);

  screen.getByRole("button").click();
});

it("convert ab*(c)", () => {
  const model = new REModel("ab*(c)");
  const updateModel = (newText) => new REModel(newText);
  const content = <REView model={model} updateModel={updateModel} />;
  // ReactDOM.render(, div);
  render(content);

  screen.getByRole("button").click();
});

it("convert (ab)*c", () => {
  const model = new REModel("(ab)*c");
  const updateModel = (newText) => new REModel(newText);
  const content = <REView model={model} updateModel={updateModel} />;
  // ReactDOM.render(, div);
  render(content);

  screen.getByRole("button").click();
});
