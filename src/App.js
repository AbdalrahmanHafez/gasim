import { createRef, useEffect, useState } from "react";
import Cytoscape from "./components/Cytoscape";
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
    $(function () {
      $("#tabs").tabs();
    });
  }, []);

  return (
    <div className="App">
      <h1>cytoscape-popper demo</h1>
      {/* <Cytoscape namevalue={namevalue} cyEvents={cyEvents} /> */}
      {/* <TestPage /> */}
      {/* <TabsController data={tabsData} /> */}

      <div id="tabs">
        <ul>
          <li>
            <a href="#tabs-1">Tab1</a>
          </li>
          <li>
            <a href="#tabs-2">Tab2</a>
          </li>
          <li>
            <a href="#tabs-3">Tab3</a>
          </li>
        </ul>
        <div id="tabs-1">
          <CyToolBar
            tbEnableAdding={tbEnableAdding}
            setTbEnableAdding={setTbEnableAdding}
            tbEnableDeleting={tbEnableDeleting}
            setTbEnableDeleting={setTbEnableDeleting}
          />
          <Cytoscape
            tbEnableAdding={tbEnableAdding}
            tbEnableDeleting={tbEnableDeleting}
          />
        </div>
        <div id="tabs-2">
          {/* <Cytoscape namevalue={namevalue} cyEvents={cyEvents} /> */}
        </div>
        <div id="tabs-3">{/* <p>Hello from 3</p> */}</div>
      </div>
    </div>
  );
}

export default App;
