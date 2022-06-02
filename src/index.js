import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import App from "./App";
import AdminApp from "./AdminApp";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider, createStore } from "easy-peasy";
import model from "./model";
import Store from "./Stores/Store";
import AdminStore from "./Stores/AdminStore";
import TestPage from "./TestPages/index.js";
import TestRerender from "./TestPages/TestRerender";
import { getCookie, setCookie } from "./utils";

const store = createStore(model);

const basedOnPath = () => {
  switch (window.location.pathname) {
    case "/test":
      return (
        <Store>
          <TestPage />
        </Store>
      );
    case "/admin":
      return (
        <AdminStore>
          <AdminApp />
        </AdminStore>
      );

    case "/test2":
      return <TestRerender />;

    default:
      return (
        <Store>
          <App />
        </Store>
      );
  }
};

setTimeout(() => {
  if (getCookie("tutorialDone") !== undefined) return;

  window
    .introJs()
    .oncomplete(() => {
      setCookie("tutorialDone", "true", 365);
    })
    .setOptions({
      steps: [
        {
          title: "Welcome User 👋",
          intro: "Click next to start the tutorial",
        },
        {
          title: "New Node",
          intro: "Double click on the background to create a node.",
        },
        {
          title: "Connect Nodes",
          intro:
            "Enable transition -top left-, then drag between nodes to create a new edge.",
        },
        {
          title: "Context Menu",
          intro:
            "Right click to explore more optios, such as setting an inital/final node.",
        },
        {
          title: "Rename",
          intro: "To Rename double click an Edge or Node.",
        },
      ],
    })
    .start();
}, 1000);

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>{basedOnPath()}</StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
