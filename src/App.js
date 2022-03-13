import { useEffect, useState } from "react";
import Cytoscape from "./components/Cytoscape";

// cytoscape.use(popper);
// cytoscape.use(edgehandles);

function App() {
  const [value, setValue] = useState("khaled");
  return (
    <div className="App">
      <h1>cytoscape-popper demo</h1>

      <Cytoscape value={value} />

      <div id="buttons">
        <button
          onClick={() => {
            setValue("omar");
          }}
        >
          chane to omar
        </button>
        <button id="start">Start on selected</button>
        <button id="draw-on">Draw mode on</button>
        <button id="draw-off">Draw mode off</button>
        <button id="popper">Use custom popper handles</button>
      </div>
    </div>
  );
}

export default App;
