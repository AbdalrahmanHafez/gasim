import { createRef, useEffect, useState } from "react";
import Cytoscape from "./components/Cytoscape";
import Cytoscape2 from "./components/Cytoscape2";
import Cytoscape3 from "./components/Cytoscape3";
import TestPage from "./components/TestPage";
import TabsController from "./components/TabsController";
import CyToolBar from "./components/CyToolBar";

// cytoscape.use(popper);
// cytoscape.use(edgehandles);

function App() {
  const [tbEnableAdding, setTbEnableAdding] = useState(false);
  const [tbEnableDeleting, setTbEnableDeleting] = useState(false);
  const [namevalue, setnamevalue] = useState("khaled");
  const cyEvents = {
    setClickable: () => {
      console.log("calling the original");
    },
  };
  const [tabsData, settabsData] = useState({
    labels: ["one", "two", "three"],
    Content: [
      <h1>hello</h1>,
      <Cytoscape namevalue={namevalue} cyEvents={cyEvents} />,
      "cthree",
    ],
  });

  useEffect(() => {
    var $ = window.jQuery;
    $("#tabs").tabs();
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
            <a href="#tab-1">Tab1</a>
          </li>
          <li>
            <a href="#tab-2">Tab2</a>
          </li>
          <li>
            <a href="#tab-3">Tab3</a>
          </li>
        </ul>
        <div id="tab-1">
          {/* <Cytoscape
            tabId={1}
            tbEnableAdding={tbEnableAdding}
            tbEnableDeleting={tbEnableDeleting}
          /> */}
          {/* <Cytoscape2
            p={p}
            tabId={1}
            tbEnableAdding={tbEnableAdding}
            tbEnableDeleting={tbEnableDeleting}
          /> */}

          <Cytoscape3
            tabId={1}
            tbEnableAdding={tbEnableAdding}
            tbEnableDeleting={tbEnableDeleting}
          />
        </div>
        <div id="tab-2">
          <h1>tab 2</h1>
          {/* <Cytoscape namevalue={namevalue} cyEvents={cyEvents} /> */}
        </div>
        <div id="tab-3">
          <h1>tab 3</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
