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
      <h1>cytoscape-popper demo</h1>

      <Button onClick={addTab}>Add Tab</Button>
      <TabsController />
    </div>
  );
}

export default App;
