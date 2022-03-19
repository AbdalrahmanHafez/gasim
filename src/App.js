import { useRef, useEffect, useState } from "react";
import Cytoscape from "./components/Cytoscape";
import Cytoscape2 from "./components/Cytoscape2";
import Cytoscape3 from "./components/Cytoscape3";
import TestPage from "./components/TestPage";
import TabsController from "./components/TabsController";
import CyToolBar from "./components/CyToolBar";
import MainClass from "./controller/Main.js";

// cytoscape.use(popper);
// cytoscape.use(edgehandles);

function App() {
  const [tbEnableAdding, setTbEnableAdding] = useState(false);
  const [tbEnableDeleting, setTbEnableDeleting] = useState(false);
  const Main = useRef(null);

  console.log("render App");

  const [tabsData, settabsData] = useState({
    labels: ["one", "two", "three"],
    Content: [<h1>hello</h1>, <Cytoscape3 tabId={1} />, "cthree"],
  });

  useEffect(() => {
    console.log("useEffect App");
    var $ = window.jQuery;

    $("#tabs").tabs();
    $("#tabs").tabs({ active: 1 });

    Main.current = new MainClass();
    Main.current.sayhi();
    Main.current.initialize(); // WARN: cy nodes stack on each other, if tabs is not active
  }, []);

  return (
    <div className="App">
      <h1>cytoscape-popper demo</h1>
      {/* <Cytoscape namevalue={namevalue} cyEvents={cyEvents} /> */}
      {/* <TestPage /> */}
      {/* <TabsController data={tabsData} /> */}

      <CyToolBar
        tbEnableAdding={tbEnableAdding}
        setTbEnableAdding={setTbEnableAdding}
        tbEnableDeleting={tbEnableDeleting}
        setTbEnableDeleting={setTbEnableDeleting}
      />
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
          <div id="cy-0" className="cy" />
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
          <div id="cy-2" className="cy" />
          <h1>Tab 2</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
