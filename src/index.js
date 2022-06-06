import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "./App";
import AdminApp from "./AdminApp";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider, createStore } from "easy-peasy";
import model from "./model";
import Store from "./Stores/Store";
import TrackingStore from "./Stores/TrackingStore";
import AdminStore from "./Stores/AdminStore";
import TestPage from "./TestPages/index.js";
import TestRerender from "./TestPages/TestRerender";
import {
  isProduction,
  isDevelopement,
  getCookie,
  setCookie,
  localGetItem,
  localSetItem,
} from "./utils";
import Test2 from "./TestPages/Test2";

// Sentry.init({
//   dsn: "https://51e31f1df6d44bd08775274cd21e773f@o1273072.ingest.sentry.io/6467203",
//   integrations: [new BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

// const trackingUrl = isProduction()
//   ? "https://gasim-server.herokuapp.com/track"
//   : "http://localhost:8080/track";
// window.addEventListener("error", (e) => {
//   if (
//     e.message ===
//       "Uncaught EvalError: Possible side-effect in debug-evaluate" ||
//     e.message === "Uncaught SyntaxError: Unexpected end of input" ||
//     e.message.includes("Uncaught SyntaxError:")
//   ) {
//     return;
//   }
//   if (e.error.hasBeenCaught !== undefined) {
//     return false;
//   }
//   e.error.hasBeenCaught = true;
//   // Save every cyinst elments
//   const cyinst = window.cyinst?.map((cy) => cy.json().elements);

//   console.log("error occured and caught by me");
//   console.log(e);

//   // fetch("http://localhost:8080/")
//   //   .then((response) => response.text())
//   //   .then((data) => console.log(data));

//   let trackingObject = {
//     error: { message: e.error.message, stack: e.error.stack },
//     history: window.trackHistory || [],
//     timestamp: new Date().toString(),
//   };

//   if (cyinst !== undefined) {
//     trackingObject.cyinst = cyinst;
//   }

//   fetch(trackingUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(trackingObject),
//   })
//     .then((res) => res.text())
//     .then((data) => console.log(data));
// });

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
      return <Test2 />;

    default:
      return (
        <Store>
          <App />
        </Store>
      );
  }
};

setTimeout(() => {
  if (localGetItem("tutorialDone") !== null) return;

  window
    .introJs()
    .oncomplete(() => {
      localSetItem("tutorialDone", true);
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
    <TrackingStore>
      <StoreProvider store={store}>{basedOnPath()}</StoreProvider>
    </TrackingStore>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
