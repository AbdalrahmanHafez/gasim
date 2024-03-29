import React, { useContext, useEffect } from "react";
import { Space, Col, Divider, Row, Button } from "antd";
import { StoreContext, UserViews } from "../../../Stores/Store";
import axios from "axios";
import axResource from "../../../utils/httpCommon";

const LoadingExercisesPlaceholder = () => (
  <div className="border border-blue-300 shadow rounded-md p-4 w-full mx-auto">
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-slate-400 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-400 rounded col-span-2"></div>
            <div className="h-2 bg-slate-400 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-slate-400 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

function ExerciseItem({ title, description, onClick }) {
  return (
    <div onClick={onClick} className="mb-3 border-2 p-3 rounded cursor-pointer">
      <h3 className="font-bold">{title}</h3>
      <h4>{description}</h4>
    </div>
  );
}

function ExList() {
  const { exData, setExData, setView } = useContext(StoreContext);

  const fetchExercises = () => {
    axResource.get("/getExercises").then((res) => {
      const data = res.data;
      console.log("fetched exercise list is ", data);

      // data.map((ex) => ({
      //   title: ex.title,
      //   description: ex.description,
      //   items: ex.items,
      // }));

      setExData(data);
    });
  };

  useEffect(() => {
    console.log("[ExList] useEffect");

    fetchExercises();
  }, []);

  const handleExSelection = (key) => {
    console.log("selected ex key", key);
    setView({ type: UserViews.EX_SOLVE, key: key });
  };

  return (
    <div className="w-auto m-4 p-2 ">
      <Divider orientation="left">Exercises</Divider>

      {exData === undefined ? (
        <LoadingExercisesPlaceholder />
      ) : (
        exData.length === 0 && (
          <div className="text-center">
            <h3>No exercises</h3>
          </div>
        )
      )}

      {exData &&
        exData.map((ex, key) => (
          <ExerciseItem
            key={key}
            title={ex.title}
            description={ex.description}
            onClick={() => handleExSelection(key)}
          />
        ))}
    </div>
  );
}

export default ExList;
