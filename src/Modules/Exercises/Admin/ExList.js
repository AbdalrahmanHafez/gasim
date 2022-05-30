import React from "react";
import { Space, Col, Divider, Row, Button } from "antd";

function ExerciseItem({ title, description, onClick }) {
  return (
    <div onClick={onClick} className="border-2 p-3 rounded cursor-pointer">
      <h3 className="font-bold">{title}</h3>
      <h4>{description}</h4>
    </div>
  );
}

function ExList({ list, onSelect }) {
  return (
    <div className="w-auto m-4 p-2 ">
      <Divider orientation="left">Exercises</Divider>

      {list.map((ex, key) => (
        <ExerciseItem
          key={key}
          title={ex.title}
          description={ex.description}
          onClick={() => onSelect(key)}
        />
      ))}

      <Space className="mt-4" dir="horizontal">
        <Button>Add New</Button>
      </Space>
    </div>
  );
}

export default ExList;
