import TabsController from "./components/TabsController";
import { useStoreActions } from "easy-peasy";
import { useEffect, useContext, useState } from "react";
import MenuBar from "./components/MenuBar";
import { StoreContext } from "./Stores/Store";

function App() {
  console.log("[APP] render");

  const { activeTabKey, setActiveTabKey } = useContext(StoreContext);

  useEffect(() => {
    console.log("[APP] useEffect");
  }, []);

  return (
    <div id="App">
      <div className="flex">
        <h1>Graphical Automata Simulator</h1>
        <a
          className="border rounded-xl mt-1 ml-2 h-6 px-2 border-cyan-400 hover:bg-slate-200 cursor-pointer italic hover:not-italic"
          href="https://www.google.com"
          target="_blank"
          rel="noreferrer"
        >
          Give a reivew!
        </a>
      </div>

      <MenuBar activeTabKey={activeTabKey} setActiveTabKey={setActiveTabKey} />
      <TabsController
        activeTabKey={activeTabKey}
        setActiveTabKey={setActiveTabKey}
      />
    </div>
  );
}

export default App;
