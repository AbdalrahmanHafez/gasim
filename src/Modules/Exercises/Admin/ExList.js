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
      <div className="p-2 border rounded-md">
        <b>Question Types</b> <br />
        <div className="ml-2">
          <span>* Text is non-editable text shown to the user.</span>
          <br />
          <span>
            * NFA/DFA/PDA/RE/GR/TM are non-editable machines shown to the user.
          </span>
          <br />
          <span>
            * Equivalence Shows the question machine to the user, and you have
            to provide the answer machine. Then equivalence is checked between
            your answer machine and the user's.
          </span>
          <br />
          <span>
            * StringAcceptance Shows the question machine to the user alongside
            a textbox to write a string, this string is then checkd if is
            accepted by the machine.
          </span>
        </div>
      </div>

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
