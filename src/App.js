import TabsController from "./components/TabsController";
import { useStoreActions } from "easy-peasy";
import { useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { StoreContext, UtilityContext } from "./Store.js";

function App() {
  console.log("[APP] render");
  const { addTab } = useContext(UtilityContext);

  useEffect(() => {
    console.log("[APP] useEffect");
  }, []);

  return (
    <div className="App">
      <h1>Graphical Automata Simulator</h1>
      <Button
        style={{
          position: "absolute",
          top: "45px",
          right: "0",
          "z-index": "2",
        }}
        onClick={addTab}
      >
        Add Tab
      </Button>
      <TabsController />
    </div>
  );
}

export default App;
