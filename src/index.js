import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { useRef, useEffect, useState } from "react";
import { StoreProvider, createStore } from "easy-peasy";
import model from "./model";
import Store from "./Store";
import TestPage from "./TestPages/index.js";

const store = createStore(model);

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <Store>
        {window.location.pathname === "/test" ? <TestPage /> : <App />}
      </Store>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
