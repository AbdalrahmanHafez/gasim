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
  const onClick = (key) => {
    onSelect(key);
  };

  return (
    <div>
      <Divider orientation="left">Exercises</Divider>

      {list.map((ex, i) => (
        <ExerciseItem
          key={i}
          title={ex.title}
          description={ex.description}
          onClick={() => onClick(i)}
        />
      ))}

      <Space dir="horizontal">
        <Button>Add New</Button>
      </Space>
    </div>
  );
}

export default ExList;
