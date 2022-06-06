import React, { useState } from "react";
import { Space, Input, Divider, Row, Button } from "antd";
import axResource from "../../../utils/httpCommon";

const { TextArea } = Input;

function ExerciseItem({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="border-2 p-3 rounded cursor-pointer hover:bg-slate-100"
    >
      <h3 className="font-bold">{title}</h3>
      <h4>{description}</h4>
    </div>
  );
}

function ExList({ exData, setExData, updateExercises, onSelect }) {
  const [addingEx, setaddingEx] = useState(false);
  const [extitle, setextitle] = useState("");
  const [exdesc, setexdesc] = useState("");
  const [addLoading, setaddLoading] = useState(false);

  const handleAddNewExercise = () => {
    setaddingEx(true);
  };

  const handleSaveNewExercise = () => {
    setaddLoading(true);
    axResource
      .post("/AdminAddExercise", { title: extitle, description: exdesc })
      .then((res) => {
        setaddingEx(false);

        updateExercises()
          .then(() => {})
          .catch(() => {});
      })
      .catch((error) => {
        alert(error);
        setaddLoading(false);
      });
  };

  const handleDeleteExercise = (exercise_id) => {
    axResource
      .post("/AdminRemoveExercise", {
        exercise_id,
      })
      .then(() => {
        updateExercises()
          .then(() => {})
          .catch(() => {});
      })
      .catch((error) => {
        alert("Failed to delete exercise", error);
      });
  };

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

  return (
    <div className="w-auto m-4 p-2 ">
      <div className="p-2 border rounded-md">
        <b>Question Types</b> <br />
        <div className="ml-2">
          <span>* Text is non-editable text shown to the user.</span>
          <br />
          <span>
            * NFA/DFA/PDA/RE/GR/TM are non-editable constructs shown to the
            user.
          </span>
          <br />
          <span>
            * Equivalence Shows the question constuct to the user, and you have
            to provide the answer machine. Then equivalence is checked between
            your answer machine and the user's.
          </span>
          <br />
          <span>
            * StringAcceptance Shows the question construct to the user
            alongside a textbox to write a string. This string is then checkd if
            it is accepted/generated by the construct.
          </span>
        </div>
      </div>

      <Divider orientation="left">Exercises</Divider>

      <div className="flex flex-col gap-2">
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
            <div key={key} className="relative">
              <button
                onClick={() => handleDeleteExercise(ex._id)}
                className="!absolute top-0 right-0 w-10 h-7 hover:bg-red-500 hover:text-white rounded-sm"
              >
                &#10005;
              </button>
              <ExerciseItem
                key={key}
                title={ex.title}
                description={ex.description}
                onClick={() => onSelect(key)}
              />
            </div>
          ))}
      </div>

      {addingEx === true ? (
        <div className="mt-4 rounded-md w-full bg-gradient-to-r p-[4px] from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]">
          <div className="flex flex-col justify-between h-full bg-white rounded-sm p-4 relative">
            <button
              onClick={() => setaddingEx(false)}
              className="!absolute top-0 right-0 w-10 h-7 hover:bg-slate-200 rounded-sm"
            >
              &#10005;
            </button>

            <b>New Exercise</b>
            <div>
              <span>Title</span>
              <Input
                placeholder="Title"
                value={extitle}
                onChange={(e) => setextitle(e.target.value)}
              />
            </div>
            <span className="mt-1">Description</span>
            <TextArea
              placeholder="Description"
              value={exdesc}
              onChange={(e) => setexdesc(e.target.value)}
            />
            <div>
              <Button
                onClick={() => handleSaveNewExercise()}
                loading={addLoading}
                className="mt-2"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Space className="mt-4" dir="horizontal">
          <Button onClick={() => handleAddNewExercise()}>Add New</Button>
        </Space>
      )}
    </div>
  );
}

export default ExList;
