import React, { useContext, useEffect } from "react";
import { Space, Col, Divider, Row, Button } from "antd";
import { StoreContext, UserViews } from "../../../Stores/Store";
import axios from "axios";
import axResource from "../../../utils/httpCommon";

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

  useEffect(() => {
    console.log("[ExList] useEffect");
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
    // setExData([
    //   {
    //     title: "Exerceise 1",
    //     description: "This is the first exercise",
    //   },
    //   {
    //     title: "Exerceise 2",
    //     description: "This is the second exercise",
    //   },
    //   {
    //     title: "Exerceise 3",
    //     description: "This is the third exercise",
    //   },
    // ]);
  }, []);

  const handleExSelection = (key) => {
    console.log("selected ex key", key);
    setView({ type: UserViews.EX_SOLVE, key: key });
  };

  if (exData === undefined && exData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-auto m-4 p-2 ">
      <Divider orientation="left">Exercises</Divider>

      {exData.map((ex, key) => (
        <ExerciseItem
          key={key}
          title={ex.title}
          description={ex.description}
          onClick={() => handleExSelection(key)}
        />
      ))}

      <Space className="mt-4" dir="horizontal">
        <Button>Add New</Button>
      </Space>
    </div>
  );
}

export default ExList;
