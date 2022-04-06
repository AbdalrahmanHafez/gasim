import TabsController from "./components/TabsController";
import { useStoreActions } from "easy-peasy";
import { useEffect, useContext } from "react";
import Button from "@mui/material/Button";

function App() {
  console.log("[APP] render");

  useEffect(() => {
    console.log("[APP] useEffect");
  }, []);

  return (
    <div className="App">
      <h1>Graphical Automata Simulator</h1>

      <TabsController />
    </div>
  );
}

export default App;
