import { createRef, useEffect, useState } from "react";
import Cytoscape from "./components/Cytoscape";

// cytoscape.use(popper);
// cytoscape.use(edgehandles);

function App() {
  const [namevalue, setnamevalue] = useState("khaled");
  const cyEvents = {
    setClickable: () => {
      console.log("calling the original");
    },
  };

  return (
    <div className="App">
      <h1>cytoscape-popper demo</h1>

      <Cytoscape namevalue={namevalue} cyEvents={cyEvents} />

      {/* <button
          onClick={() => {
            console.log("click enable");
            cyEvents.setClickable(true);
          }}
        >
          Enable Adding new
        </button>
        <button
          onClick={() => {
            console.log("click disable");
            cyEvents.setClickable(false);
          }}
        >
          Disable Adding new
        </button> */}
    </div>
  );
}

export default App;
