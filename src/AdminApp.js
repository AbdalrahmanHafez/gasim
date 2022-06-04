import TabsController from "./components/TabsController";
import { useStoreActions } from "easy-peasy";
import { useEffect, useContext, useState } from "react";
import MenuBar from "./components/MenuBar";
import { AdminStoreCtx, AdminViews } from "./Stores/AdminStore";
import { ExercisesStub } from "./Modules/Exercises/Admin/API_stub";
import ExList from "./Modules/Exercises/Admin/ExList";
import ExerciseView from "./Modules/Exercises/Admin/ExerciseView";

function AdminApp() {
  console.log("[AdminApp] render");

  const { exData, setExData, view, setView } = useContext(AdminStoreCtx);

  useEffect(() => {
    console.log("[AdminApp] useEffect");

    // https://stackoverflow.com/questions/35469836/detecting-production-vs-development-react-at-runtime
    setExData(ExercisesStub);
  }, []);

  if (!exData) {
    return <div>Loading...</div>;
  }

  const Content = () => {
    const { type } = view;
    switch (type) {
      case AdminViews.LIST_ALL: {
        const handleExSelection = (key) => {
          // console.log("selected exId:", key);
          setView({ type: AdminViews.VIEW_EXE, key: key });
        };
        return <ExList list={exData} onSelect={handleExSelection} />;
      }

      case AdminViews.ADD_EXE:
        return <div>ADDINGN a new EXCERISE</div>;

      case AdminViews.EDIT_EXE:
        return <div>Edit an Excersice</div>;

      case AdminViews.VIEW_EXE: {
        const { key } = view;
        const updateEx = (newExercise) => {
          const newExData = [...exData];
          newExData[key] = newExercise;
          setExData(newExData);
        };

        return <ExerciseView ex={exData[key]} updateEx={updateEx} />;
      }

      default:
        return <div>Invalid Excersice State {JSON.stringify(view)} </div>;
    }
  };

  return (
    <div className="AdminApp">
      <h1>Graphical Automata Simulator :: Welcome Admin</h1>

      <Content />
    </div>
  );
}

export default AdminApp;
