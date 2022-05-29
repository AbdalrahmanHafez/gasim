import React from "react";
import { Space, Col, Divider, Row, Button } from "antd";

function ExerciseItem({ title, description, onClick }) {
  return (
    <div onClick={onClick} style={{ width: "80vh", backgroundColor: "snow" }}>
      <h3>{title}</h3>
      <h4>{description}</h4>
    </div>
  );
}

function ExList({ list, onSelect }) {
  return (
    <div>
      <Divider orientation="left">Exercises</Divider>

      {list.map((ex, key) => (
        <ExerciseItem
          key={key}
          title={ex.title}
          description={ex.description}
          onClick={() => onSelect(key)}
        />
      ))}

      <Space dir="horizontal">
        <Button>Add New</Button>
      </Space>
    </div>
  );
}

export default ExList;
