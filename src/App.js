import TabsController from "./components/TabsController";
import { useStoreActions } from "easy-peasy";
import { useEffect, useContext, useState } from "react";
import MenuBar from "./components/MenuBar";
import { StoreContext, UserViews } from "./Stores/Store";
import ExList from "./Modules/Exercises/User/ExList";
import ExerciseSolve from "./Modules/Exercises/User/ExerciseSolve";
import ExSolveStore from "./Stores/Exercise/ExSolveStore";

function App() {
  console.log("[APP] render");

  const { activeTabKey, setActiveTabKey, view, setView, exData } =
    useContext(StoreContext);

  useEffect(() => {
    console.log("[APP] useEffect");
  }, []);

  const SeeSimulationMenuBar = () => (
    <div className="flex bg-gradient-to-t from-gray-100">
      <button
        onClick={() => setView({ type: UserViews.SIMVIEW })}
        className="rounded-sm border-white-500 hover:bg-gray-200 px-2 mx-1"
      >
        Back to Simulation
      </button>
    </div>
  );

  return (
    <div id="App">
      <div className="flex">
        <h1>Graphical Automata Simulator</h1>

        <a
          className="border rounded-xl mt-1 ml-2 h-6 px-2 border-cyan-400 hover:bg-slate-200 cursor-pointer italic hover:not-italic"
          href="https://forms.gle/ttTeornyhx6WnukG7"
          target="_blank"
          rel="noreferrer"
        >
          Give a reivew!
        </a>
      </div>

      {view.type === UserViews.SIMVIEW && (
        <>
          <MenuBar
            activeTabKey={activeTabKey}
            setActiveTabKey={setActiveTabKey}
          />

          <TabsController
            activeTabKey={activeTabKey}
            setActiveTabKey={setActiveTabKey}
          />
        </>
      )}

      {view.type === UserViews.EX_LIST && (
        <div>
          <SeeSimulationMenuBar />
          <ExList />
        </div>
      )}

      {view.type === UserViews.EX_VIEW && (
        <div>
          <SeeSimulationMenuBar />
          <div>{UserViews.EX_VIEW}</div>
        </div>
      )}

      {view.type === UserViews.EX_SOLVE && (
        <div>
          <ExSolveStore>
            <ExerciseSolve ex={exData[view.key]} />
          </ExSolveStore>
        </div>
      )}
    </div>
  );
}

export default App;
