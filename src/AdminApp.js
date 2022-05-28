import TabsController from "./components/TabsController";
import { useStoreActions } from "easy-peasy";
import { useEffect, useContext, useState } from "react";
import MenuBar from "./components/MenuBar";
import { AdminStoreCtx } from "./Stores/AdminStore";
import { ExercisesStub } from "./Modules/Exercises/API_stub";
import ExList from "./Modules/Exercises/ExList";
import ExerciseView from "./Modules/Exercises/ExerciseView";

function AdminApp() {
  console.log("[AdminApp] render");

  const { exData, setExData, viewEx, setViewEx } = useContext(AdminStoreCtx);

  useEffect(() => {
    console.log("[AdminApp] useEffect");

    // https://stackoverflow.com/questions/35469836/detecting-production-vs-development-react-at-runtime
    setExData(ExercisesStub);
  }, []);

  const handleExSelection = (key) => {
    console.log("selected exId:", key);
    setViewEx(key);
  };

  if (!exData) {
    return <div>Loading...</div>;
  }

  const updateEx = (newExercise) => {
    const newExData = [...exData];
    newExData[viewEx] = newExercise;
    setExData(newExData);
  };

  const content = () => {
    if (viewEx === null) {
      return <ExList list={exData} onSelect={handleExSelection} />;
    }
    if (viewEx === -1) {
      return <div>ADDINGN a new EXCERISE</div>;
    }

    return <ExerciseView ex={exData[viewEx]} updateEx={updateEx} />;
  };

  return (
    <div className="AdminApp">
      <h1>Graphical Automata Simulator :: Welcome Admin</h1>

      {content()}
    </div>
  );
}

export default AdminApp;
