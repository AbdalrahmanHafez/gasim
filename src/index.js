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
