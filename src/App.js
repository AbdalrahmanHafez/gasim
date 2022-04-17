import TabsController from "./components/TabsController";
import { useStoreActions } from "easy-peasy";
import { useEffect, useContext, useState } from "react";
import Button from "@mui/material/Button";
import MenuBar from "./components/MenuBar";

function App() {
  console.log("[APP] render");

  useEffect(() => {
    console.log("[APP] useEffect");
  }, []);

  return (
    <div className="App">
      <h1>Graphical Automata Simulator</h1>

      <MenuBar />
      <TabsController />
    </div>
  );
}

export default App;
