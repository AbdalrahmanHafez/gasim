import TabsController from "./components/TabsController";
import { useStoreActions } from "easy-peasy";
import { useEffect, useContext, useState } from "react";
import MenuBar from "./components/MenuBar";
import { AdminStoreCtx } from "./Stores/AdminStore";
import { ExercisesStub } from "./Modules/Exercises/Admin/API_stub";
import ExList from "./Modules/Exercises/Admin/ExList";
import ExerciseView from "./Modules/Exercises/Admin/ExerciseView";

function AdminApp() {
  console.log("[AdminApp] render");

  const { exData, setExData, viewEx, setViewEx } = useContext(AdminStoreCtx);

  useEffect(() => {
    console.log("[AdminApp] useEffect");

    // https://stackoverflow.com/questions/35469836/detecting-production-vs-development-react-at-runtime
    setExData(ExercisesStub);
  }, []);

  const handleExSelection = (key) => {
    // console.log("selected exId:", key);
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

  const Content = () => {
    if (viewEx === null) {
      return <ExList list={exData} onSelect={handleExSelection} />;
    }
    if (viewEx === -1) {
      return <div>ADDINGN a new EXCERISE</div>;
    }
    if (exData[viewEx] === undefined)
      return <div>Invalid Excersice Id({viewEx})</div>;

    return <ExerciseView ex={exData[viewEx]} updateEx={updateEx} />;
  };

  return (
    <div className="AdminApp">
      <h1>Graphical Automata Simulator :: Welcome Admin</h1>

      <Content />
    </div>
  );
}

export default AdminApp;
