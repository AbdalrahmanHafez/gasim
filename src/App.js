import { useRef, useEffect, useState } from "react";
import Cytoscape from "./components/Cytoscape";
import Cytoscape2 from "./components/Cytoscape2";
import Cytoscape3 from "./components/Cytoscape3";
import TestPage from "./components/TestPage";
import TabsController from "./components/TabsController";
import CyToolBar from "./components/CyToolBar";
import MainClass from "./controller/Main.js";
import Button from "@mui/material/Button";

// cytoscape.use(popper);
// cytoscape.use(edgehandles);

function App() {
  const [tbEnableAdding, setTbEnableAdding] = useState(false);
  const [tbEnableDeleting, setTbEnableDeleting] = useState(false);
  const [test, setTest] = useState({
    shown: false,
    showStep: true,
    curState: "",
    strDone: "",
    strRem: "",
    winstate: undefined,
  });

  const Main = useRef(null);

  console.log("render App");

  const [tabsData, settabsData] = useState({
    labels: ["one", "two", "three"],
    Content: [<h1>hello</h1>, <Cytoscape3 tabId={1} />, "cthree"],
  });

  useEffect(() => {
    console.log("useEffect App");
    var $ = window.jQuery;
    Main.current = new MainClass();
    Main.current.sayhi();
    Main.current.initialize(); // WARN: cy nodes stack on each other, if tabs is not active

    Main.current.setStateTest(setTest);
  }, []);

  return (
    <div className="App">
      <h1>cytoscape-popper demo</h1>
      {/* <Cytoscape namevalue={namevalue} cyEvents={cyEvents} /> */}
      {/* <TestPage /> */}
      {/* <TabsController data={tabsData} /> */}

      {/* {JSON.stringify(test)} */}

      <CyToolBar
        tbEnableAdding={tbEnableAdding}
        setTbEnableAdding={setTbEnableAdding}
        tbEnableDeleting={tbEnableDeleting}
        setTbEnableDeleting={setTbEnableDeleting}
      />
      <Button
        id="btnSimulate"
        variant="outlined"
        onClick={() => {
          Main.current.startSimulation();
        }}
      >
        Simulate input
      </Button>
      <div id="tabs">
        <ul>
          <li>
            <a href="#tab-0">Tab 0</a>
          </li>
          <li>
            <a href="#tab-1">Tab 1</a>
          </li>
          <li>
            <a href="#tab-2">Tab 2</a>
          </li>
        </ul>
        <div id="tab-0">
          <h1>Tab 0</h1>
          <div style={{ display: "flex" }}>
            <div id="cy-0" className="cy" />
            {test.shown && (
              <div id="simContainer">
                Simulation Panel
                <button
                  onClick={() => {
                    setTest((test) => ({ ...test, shown: false }));
                  }}
                >
                  &#10005;
                </button>
                <div
                  className={
                    "simCard " +
                    (test.winstate
                      ? "won"
                      : test.winstate === undefined
                      ? ""
                      : "lost")
                  }
                >
                  <div className="simCardHeader">state: {test.curState}</div>
                  <div className="simCardProgress">
                    {test.strDone}
                    <strong>{test.strRem}</strong>
                  </div>
                  <div className="simCardControles">
                    <button
                      onClick={() => {
                        Main.current.simTick();
                      }}
                      className="ui-button"
                      disabled={test.winstate !== undefined}
                    >
                      Step
                    </button>

                    {test.winstate !== undefined && (
                      <button
                        className="ui-button"
                        onClick={() => {
                          Main.current.simReset();
                        }}
                      >
                        reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <Cytoscape3
            tabId={1}
            tbEnableAdding={tbEnableAdding}
            tbEnableDeleting={tbEnableDeleting}
          /> */}
        </div>
        <div id="tab-1">
          <h1>Tab 1</h1>
          <div id="cy-1" className="cy" />
        </div>
        <div id="tab-2">
          <h1>Tab 2</h1>
          <div id="cy-2" className="cy" />
        </div>
      </div>
    </div>
  );
}

export default App;
