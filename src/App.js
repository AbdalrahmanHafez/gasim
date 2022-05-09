import TabsController from "./components/TabsController";
import { useStoreActions } from "easy-peasy";
import { useEffect, useContext, useState } from "react";
import MenuBar from "./components/MenuBar";

function App() {
  console.log("[APP] render");
  const [activeTabKey, setActiveTabKey] = useState(7);

  useEffect(() => {
    console.log("[APP] useEffect");
  }, []);

  return (
    <div className="App">
      <h1>Graphical Automata Simulator</h1>

      <MenuBar activeTabKey={activeTabKey} setActiveTabKey={setActiveTabKey} />
      <TabsController
        activeTabKey={activeTabKey}
        setActiveTabKey={setActiveTabKey}
      />
    </div>
  );
}

export default App;
