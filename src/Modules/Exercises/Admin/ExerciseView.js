import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { Input, Button, Radio } from "antd";
import { AdminStoreCtx, AdminViews } from "../../../Stores/AdminStore";
import { capitalizeFirst } from "../../../utils";
import { FSAComponent, FSAModel } from "../../FSA";
import { PDAModel, PDAComponent } from "../../PDA";
import { GRComponent, GRModel } from "../../GR";
import { InputNumber, Collapse } from "antd";
import axResource from "../../../utils/httpCommon";
const { Panel } = Collapse;

const GrammarBlock = ({ info, grref }) => {
  const [model, setmodel] = useState(new GRModel(info.productions));

  return (
    <div>
      <GRComponent
        model={model}
        updateModel={(newModel) => {
          grref.current = newModel;
          setmodel(newModel);
        }}
        editable={true}
      />
    </div>
  );
};

const RenderMachine = ({
  info,
  cyref,
  reref,
  grref,
  updateItem,
  nosave = false,
}) => {
  // const cyrefFSA = useRef(null);
  // const cyrefPDA = useRef(null);
  console.log("[RenderMachine] rerendered");

  const [inputValue, setInputValue] = useState(info.string || "");

  console.log("[RenderMachine] rerendered");

  if (!info.type) return <div>Invalid Machine Description</div>;

  const SaveBtn = () => {
    if (nosave) return null;
    return (
      <Button
        onClick={() => {
          updateItem({
            type: info.type,
            [info.type === "RE"
              ? "string"
              : info.type === "GR"
              ? "productions"
              : "elements"]:
              info.type === "RE"
                ? inputValue
                : info.type === "GR"
                ? grref.current.productions
                : cyref.current.json().elements,
          });
        }}
      >
        Save
      </Button>
    );
  };

  if (info.type === "NFA" || info.type === "DFA") {
    return (
      <div>
        <div style={{ height: "25vh" }}>
          <FSAComponent
            cyref={cyref}
            model={new FSAModel(info.elements || [])}
            updateModel={() => {}}
          />
        </div>
        <SaveBtn />
      </div>
    );
  }

  if (info.type === "RE") {
    return (
      <div>
        <Input
          ref={reref}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <SaveBtn />
      </div>
    );
  }

  if (info.type === "GR") {
    return (
      <div>
        <GrammarBlock grref={grref} info={info} />
        <SaveBtn />
      </div>
    );
  }

  if (info.type === "PDA") {
    return (
      <div>
        <div style={{ height: "25vh" }}>
          <PDAComponent
            cyref={cyref}
            model={new PDAModel(info.elements || [])}
            updateModel={() => {}}
          />
        </div>
        <SaveBtn />
      </div>
    );
  }

  return <div className="bg-red-500">Unexpected</div>;
};

const TextBlock = ({ item, updateItem }) => {
  console.log("[TextBlock] rerendered");

  const [inputValue, setInputValue] = useState(item.value.value || null);
  const [visiable, setVisiable] = useState(false);
  return (
    <div>
      <Input
        value={inputValue}
        onChange={(e) => {
          if (!visiable) setVisiable(true);
          setInputValue(e.target.value);
        }}
      />
      {visiable && (
        <Button onClick={() => updateItem({ type: "text", value: inputValue })}>
          Save
        </Button>
      )}
    </div>
  );
};

const QuestionType = ({ item, updateItem }) => {
  const [visiable, setvisiable] = useState(true);
  const [value, setValue] = useState(item.value.question.type);
  const newItemValue = useRef(item.value);
  return (
    <span>
      Question is of type a/an {item.value.question.type}{" "}
      {visiable ? (
        <b
          className="cursor-pointer hover:underline"
          onClick={() => setvisiable(false)}
        >
          change
        </b>
      ) : (
        <>
          <Radio.Group
            value={value}
            buttonStyle="solid"
            onChange={(e) => {
              setValue(e.target.value);
              newItemValue.current.question.type = e.target.value;
            }}
          >
            <Radio.Button value="NFA">NFA</Radio.Button>
            <Radio.Button value="DFA">DFA</Radio.Button>
            <Radio.Button value="RE">RE</Radio.Button>
          </Radio.Group>
          <Button onClick={() => updateItem(newItemValue.current)}>save</Button>
        </>
      )}
    </span>
  );
};

const RenderContent = ({ item, updateItem }) => {
  console.log("[RenderContent] rerendered");

  const { type } = item.value;
  const cyrefA = useRef(null);
  const cyrefB = useRef(null);
  const rerefA = useRef(null);
  const rerefB = useRef(null);
  const grref = useRef(null);

  switch (type) {
    case "text":
      return <TextBlock item={item} updateItem={updateItem} />;

    case "choice":
      return (
        <div>
          <Radio.Group
            buttonStyle="solid"
            value={item.value.answer}
            onChange={(newAnswer) => {
              updateItem({
                type: "choice",
                options: item.value.options,
                answer: newAnswer.target.value,
              });
            }}
          >
            {item.value.options.map((op, i) => (
              <Radio.Button key={i} value={op}>
                {op}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      );

    case "NFA":
      return (
        <RenderMachine
          reref={rerefA}
          cyref={cyrefA}
          info={item.value}
          updateItem={updateItem}
        />
      );

    case "DFA":
      return (
        <RenderMachine
          reref={rerefA}
          cyref={cyrefA}
          info={item.value}
          updateItem={updateItem}
        />
      );

    case "RE":
      return (
        <RenderMachine
          reref={rerefA}
          cyref={cyrefA}
          info={item.value}
          updateItem={updateItem}
        />
      );

    case "GR":
      return (
        <RenderMachine
          reref={rerefA}
          cyref={cyrefA}
          grref={grref}
          info={item.value}
          updateItem={updateItem}
        />
      );

    case "PDA":
      return (
        <RenderMachine
          reref={rerefA}
          cyref={cyrefA}
          info={item.value}
          updateItem={updateItem}
        />
      );

    case "equivalence":
      return (
        <div>
          <QuestionType item={item} updateItem={updateItem} />

          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Answer" key="1">
              <RenderMachine
                reref={rerefB}
                cyref={cyrefB}
                info={item.value.answer}
                nosave
              />
              <Button
                onClick={() => {
                  if (item.value.answer.type === "RE") {
                    const newItem = { ...item };
                    newItem.value.answer = {
                      type: "RE",
                      string: rerefB.current.input.value,
                    };
                    updateItem(newItem.value);
                  } else {
                    const newItem = { ...item };
                    newItem.value.answer = {
                      type: newItem.value.answer.type,
                      elements: cyrefB.current.json().elements,
                    };
                    updateItem(newItem.value);
                  }
                }}
              >
                Update Answer
              </Button>
            </Panel>
          </Collapse>
        </div>
      );

    case "stringAcceptance":
      return (
        <div>
          <RenderMachine
            reref={rerefA}
            cyref={cyrefA}
            grref={grref}
            info={item.value.machine}
            nosave
          />
          <Button
            onClick={() => {
              // if (item.value.machine.type === "GR") {
              //   updateAnswer(grref.current.productions);
              // } else if (
              //   item.value.machine.type === "NFA" ||
              //   item.value.machine.type === "DFA" ||
              //   item.value.machine.type === "PDA"
              // )
              //   updateAnswer(cyrefA.current.json().elements);
              // else if (item.value.machine.type === "RE") {
              //   updateAnswer(rerefA.current.input.value);
              // }
              const newItem = { ...item };
              if (newItem.value.machine.type === "GR") {
                newItem.value.machine = {
                  type: "GR",
                  productions: grref.current.productions,
                };
                // updateAnswer(grref.current.productions);
              } else if (
                newItem.value.machine.type === "NFA" ||
                newItem.value.machine.type === "DFA" ||
                newItem.value.machine.type === "PDA"
              )
                // updateAnswer(cyrefA.current.json().elements);
                newItem.value.machine = {
                  type: newItem.value.machine.type,
                  elements: cyrefA.current.json().elements,
                };
              else if (newItem.value.machine.type === "RE") {
                // updateAnswer(rerefA.current.input.value);
                newItem.value.machine = {
                  type: "RE",
                  string: rerefA.current.input.value,
                };
              }
              updateItem(item.value);
            }}
          >
            Update Answer
          </Button>
        </div>
      );

    default:
      return null;
  }
};

const BlockView = ({ item, updateItem, deleteItem }) => {
  console.log("[BLockView] rerendered");
  const [loading, setloading] = useState(false);

  const updateChoice = (e) => {
    const newChoice = e.target.value;
    updateItem({ ...item, answer: newChoice });
  };

  const updateText = (newText) => {
    updateItem({ ...item, value: newText });
  };

  const updateQuestionType = (newType) => {
    updateItem({
      ...item,
      question: { ...item.value.question, type: newType },
    });
  };

  const updateQuestion = (newElements) => {
    // updateContent({ ...content, value: newText });
    const { type } = item.value;
    if (type === "equivalence") {
      // then we're updating the answer
      if (
        item.value.question.type === "NFA" ||
        item.value.question.type === "DFA"
      ) {
        updateItem({
          ...item,
          question: { ...item.value.question, elements: newElements },
        });
      } else if (item.value.question.type === "RE") {
        updateItem({
          ...item,
          question: { ...item.value.question, string: newElements },
        });
      }
    } else if (type === "stringAcceptance") {
      if (item.value.machine.type === "GR") {
        updateItem({
          ...item,
          machine: { ...item.value.machine, productions: newElements },
        });
      } else if (
        item.value.machine.type === "NFA" ||
        item.value.machine.type === "DFA" ||
        item.value.machine.type === "PDA"
      ) {
        updateItem({
          ...item,
          machine: { ...item.value.machine, elements: newElements },
        });
      } else if (item.value.machine.type === "RE") {
        updateItem({
          ...item,
          machine: { ...item.value.machine, string: newElements },
        });
      }
    }
  };

  const updateAnswer = (newElements) => {
    // updateContent({ ...content, value: newText });
    const { type } = item;
    if (type === "equivalence") {
      // then we're updating the answer
      if (
        item.value.answer.type === "NFA" ||
        item.value.answer.type === "DFA"
      ) {
        updateItem({
          ...item,
          answer: { ...item.value.answer, elements: newElements },
        });
      } else if (item.value.answer.type === "RE") {
        updateItem({
          ...item,
          answer: { ...item.value.answer, string: newElements },
        });
      }
    } else if (type === "stringAcceptance") {
      if (item.value.machine.type === "GR") {
        updateItem({
          ...item,
          machine: { ...item.value.machine, productions: newElements },
        });
      } else if (
        item.value.machine.type === "NFA" ||
        item.value.machine.type === "DFA" ||
        item.value.machine.type === "PDA"
      ) {
        updateItem({
          ...item,
          machine: { ...item.value.machine, elements: newElements },
        });
      } else if (item.value.machine.type === "RE") {
        updateItem({
          ...item,
          machine: { ...item.value.machine, string: newElements },
        });
      }
    }
  };

  return (
    <div className="m-4 relative flex flex-col">
      <h3 className="absolute right-2 top-px text-slate-400 z-10">
        {capitalizeFirst(item.value.type)}
      </h3>
      <RenderContent
        item={item}
        updateItem={updateItem}
        updateAnswer={updateAnswer}
      />
      <h3 className="ml-auto">
        <Button
          loading={loading}
          onClick={() => {
            setloading(true);
            deleteItem()
              .then(() => {})
              .catch(() => {
                setloading(false);
              });
          }}
        >
          Delete
        </Button>
      </h3>
    </div>
  );
};

const FreeInput = ({ onChange }) => {
  const [value, setvalue] = useState("");
  return (
    <Input
      value={value}
      onChange={(e) => {
        setvalue(e.target.value);
        onChange();
      }}
    />
  );
};

function RenderNewBlock({ blockType, setSavedItem }) {
  const [textValue, setTextValue] = useState("");

  const [numberChoices, setNumberChoices] = useState(2);
  const [selectedChoice, setSelectedChoice] = useState(0);
  const selectedChoicev = useRef(0);
  const radref = useRef(null);

  const [questionType, setquestionType] = useState("DFA");
  const [answerType, setanswerType] = useState("DFA");
  const [answer, setanswer] = useState(null);
  const cyref = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [fsamodel, setfsamodel] = useState(new FSAModel([]));
  const [pdamodel, setpdamodel] = useState(new PDAModel([]));

  const [machineType, setMachineType] = useState("DFA");
  const [grmodel, setgrmodel] = useState(new GRModel([["S", ""]]));

  switch (blockType) {
    case "text":
      return (
        <div>
          <h3>Enter the text </h3>
          <Input
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              setSavedItem({ type: "text", value: e.target.value });
            }}
          />
        </div>
      );

    case "choice":
      const saveChoices = () => {
        const options = [];

        [...radref.current.querySelectorAll('input[type="text"]')]
          .map((e) => e.value)
          .forEach((v) => options.push(v));

        const finalObject = {
          type: "choice",
          options,
          answer: options[+selectedChoicev.current],
        };
        console.log("final object is ", finalObject);

        setSavedItem(finalObject);
        // [...temp1.current.querySelectorAll('input[type="radio"]')].map(e=>e.checked)
        // [...temp1.current.querySelectorAll('input[type="text"]')].map(e=>e.value)

        // radref.current.querySelectorAll('input[type="radio"]')
        // setSaveObject()
      };

      return (
        <div>
          <h3>How many:</h3>
          <InputNumber
            min={2}
            value={numberChoices}
            onChange={(nc) => setNumberChoices(nc)}
          />

          <Radio.Group
            ref={radref}
            value={selectedChoice}
            onChange={(e) => {
              console.log("chaning radio?");
              setSelectedChoice(e.target.value);
              selectedChoicev.current = e.target.value;
              console.log("e target value", e.target.value);
              saveChoices();
            }}
          >
            <div className="flex flex-col">
              {new Array(numberChoices).fill(0).map((_, i) => (
                <Radio key={i} value={i}>
                  <FreeInput onChange={saveChoices} />
                </Radio>
              ))}
            </div>
          </Radio.Group>
        </div>
      );

    case "NFA": {
      const save = () => {
        setSavedItem({
          type: "NFA",
          elements: cyref.current?.json().elements,
        });
      };
      save();
      return (
        <div style={{ height: "25vh" }}>
          <FSAComponent
            cyref={cyref}
            model={fsamodel}
            updateModel={(nmodel) => {
              setfsamodel(nmodel);
              // setSavedItem({
              //   type: "NFA",
              //   elements: nmodel.elements,
              // });
              save();
            }}
          />
        </div>
      );
    }

    case "DFA": {
      const save = () => {
        setSavedItem({
          type: "DFA",
          elements: cyref.current?.json().elements,
        });
      };
      save();
      return (
        <div style={{ height: "25vh" }}>
          <FSAComponent
            cyref={cyref}
            model={fsamodel}
            updateModel={(nmodel) => {
              setfsamodel(nmodel);
              // setSavedItem({
              //   type: "DFA",
              //   elements: nmodel.elements,
              // })
              save();
            }}
          />
        </div>
      );
    }

    case "RE": {
      return (
        <Input
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
            setSavedItem({ type: "RE", string: e.target.value });
          }}
        />
      );
    }

    case "PDA": {
      const save = () => {
        setSavedItem({
          type: "PDA",
          elements: cyref.current?.json().elements,
        });
      };
      save();
      return (
        <div style={{ height: "25vh" }}>
          <PDAComponent
            cyref={cyref}
            model={pdamodel}
            updateModel={(nmodel) => {
              setpdamodel(nmodel);
              //   setSavedItem({
              //     type: "PDA",
              //     elements: nmodel.elements,
              //   })
              save();
            }}
          />
        </div>
      );
    }

    case "GR":
      const save = () => {
        setSavedItem({
          type: "GR",
          productions: grmodel.productions,
        });
        console.log("inside save() elements is", grmodel.productions);
      };
      save();
      return (
        <GRComponent
          model={grmodel}
          updateModel={(newModel) => {
            setSavedItem({
              type: "GR",
              productions: newModel.productions,
            });
            setgrmodel(newModel);
          }}
          editable={true}
        />
      );

    case "equivalence":
      const finalItem = {
        type: "equivalence",
        question: {
          type: questionType,
        },
        answer: {
          type: answerType,
          [answerType === "RE" ? "string" : "elements"]:
            answerType === "RE" ? inputValue : fsamodel.elements,
        },
      };
      const saveData = () => {
        // console.log("final item is ", finalItem);
        setSavedItem(finalItem);
      };

      saveData();

      return (
        <div>
          <div className="flex">
            <div className="w-1/2">
              <h3>Question Type</h3>
              <Radio.Group
                value={questionType}
                onChange={(e) => {
                  setquestionType(e.target.value);
                  saveData();
                }}
              >
                <Radio value="DFA"> DFA </Radio>
                <Radio value="NFA"> NFA </Radio>
                <Radio value="RE"> RE </Radio>
              </Radio.Group>
            </div>

            <div className="w-1/2">
              <h3>Answer Type</h3>
              <Radio.Group
                value={answerType}
                onChange={(e) => {
                  setanswerType(e.target.value);
                  saveData();
                }}
              >
                <Radio value="DFA"> DFA </Radio>
                <Radio value="NFA"> NFA </Radio>
                <Radio value="RE"> RE </Radio>
              </Radio.Group>
            </div>
          </div>

          <div className="h-40">
            <h3>The answer</h3>
            {answerType === "NFA" || answerType === "DFA" ? (
              <div style={{ height: "25vh" }}>
                <FSAComponent
                  cyref={cyref}
                  model={fsamodel}
                  updateModel={(newModel) => {
                    // cyref.current = newModel;
                    setfsamodel(newModel);
                    // console.log("update model");
                    // saveData();
                  }}
                />
              </div>
            ) : answerType === "RE" ? (
              <div>
                <Input
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    saveData();
                  }}
                />
              </div>
            ) : (
              "Select a type"
            )}
          </div>
        </div>
      );

    case "stringAcceptance": {
      const saveData = () => {
        const finalItem = {
          type: "stringAcceptance",
          machine: {
            type: machineType,
            [machineType === "RE"
              ? "string"
              : machineType === "GR"
              ? "productions"
              : "elements"]:
              machineType === "RE"
                ? cyref.current
                : machineType === "GR"
                ? cyref.current.productions
                : cyref.current?.json?.().elements,
          },
        };
        console.log("final item is ", finalItem);
        setSavedItem(finalItem);
      };
      return (
        <div>
          <h3>Choose the type</h3>
          <Radio.Group
            value={machineType}
            onChange={(e) => {
              setMachineType(e.target.value);
              saveData();
            }}
          >
            <Radio value="DFA"> DFA </Radio>
            <Radio value="NFA"> NFA </Radio>
            <Radio value="RE"> RE </Radio>
            <Radio value="PDA"> PDA </Radio>
            <Radio value="GR"> Grammar </Radio>
          </Radio.Group>

          {machineType === "NFA" || machineType === "DFA" ? (
            <div style={{ height: "25vh" }}>
              <FSAComponent
                cyref={cyref}
                model={new FSAModel([])}
                updateModel={() => saveData()}
              />
            </div>
          ) : machineType === "PDA" ? (
            <div style={{ height: "25vh" }}>
              <PDAComponent
                cyref={cyref}
                model={new PDAModel([])}
                updateModel={() => saveData()}
              />
            </div>
          ) : machineType === "RE" ? (
            <div>
              <Input
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  cyref.current = e.target.value;
                  saveData();
                }}
              />
            </div>
          ) : machineType === "GR" ? (
            <GRComponent
              model={grmodel}
              updateModel={(newModel) => {
                setgrmodel(newModel);
                cyref.current = newModel;
                saveData();
              }}
              editable={true}
            />
          ) : (
            "Select a type"
          )}
        </div>
      );
    }

    default:
      return null;
  }
}

const AddBlock = ({ addItemToEx }) => {
  const [bool, setbool] = useState(true);
  const [blockType, setBlockType] = useState(null);
  const [loading, setLoading] = useState(false);

  const tobesavedObject = useRef(null);

  const resetState = () => {
    setbool(true);
    setBlockType(null);
  };

  const setSavedItem = (newItem) => {
    tobesavedObject.current = newItem;
  };

  if (blockType) {
    return (
      <div>
        <RenderNewBlock blockType={blockType} setSavedItem={setSavedItem} />

        <Button
          loading={loading}
          onClick={() => {
            console.log("tobesavedObject is", tobesavedObject.current);
            if (
              tobesavedObject.current === null ||
              Object.keys(tobesavedObject.current).length === 0
            ) {
              alert("please provide values");
              return;
            }
            setLoading(true);
            addItemToEx(tobesavedObject.current)
              .then(() => {
                setLoading(false);
                resetState();
              })
              .catch(() => setLoading(false));
            // resetState();
          }}
        >
          Save Block
        </Button>
        <Button onClick={() => resetState()}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="h-40 m-4">
      {bool ? (
        <Button block type="primary" onClick={() => setbool(false)}>
          Add Block
        </Button>
      ) : (
        <div className="flex items-baseline w-full justify-evenly">
          <h3>Select block type</h3>

          <div>
            <Button onClick={() => setBlockType("text")}>Text</Button>
            <Button onClick={() => setBlockType("choice")}>Choice</Button>
            <Button onClick={() => setBlockType("NFA")}>NFA</Button>
            <Button onClick={() => setBlockType("DFA")}>DFA</Button>
            <Button onClick={() => setBlockType("PDA")}>PDA</Button>
            <Button onClick={() => setBlockType("RE")}>RegEx</Button>
            <Button onClick={() => setBlockType("GR")}>Grammar</Button>
            {/* <Button onClick={() => setBlockType("TM")}>TM</Button> */}
            <Button onClick={() => setBlockType("equivalence")}>
              Equivalence
            </Button>
            <Button onClick={() => setBlockType("stringAcceptance")}>
              String Acceptance
            </Button>
          </div>

          <button
            className="italic text-slate-500"
            onClick={() => resetState()}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

function ExerciseView({ ex, updateEx }) {
  const { setView } = useContext(AdminStoreCtx);
  console.log("[ExerciseView] rerendered");
  console.log("ex is ", ex);

  const BackButton = () => {
    return (
      <Button onClick={() => setView({ type: AdminViews.LIST_ALL })}>
        Back
      </Button>
    );
  };

  const updateItem = (newValue, i) => {
    // i is the key
    const oldValue = ex.items[i].value;
    const newEx = { ...ex };
    newEx.items[i].value = newValue;
    updateEx(newEx);

    // request to update DB
    axResource
      .post("/AdminUpdateItem", newEx.items[i])
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log("error while updating Item", error);
        const newEx = { ...ex };
        newEx.items[i].value = oldValue;
        updateEx(newEx);
      });
  };

  const deleteItem = (i) => {
    // i is the key
    const item_id = ex.items[i]._id;

    // request to update DB
    return axResource
      .post("/AdminDeleteExecersiceItem", {
        exercise_id: ex._id,
        item_id: item_id,
      })
      .then((res) => {
        console.log(res);
        const newEx = { ...ex };
        newEx.items.splice(i, 1);
        updateEx(newEx);
      })
      .catch((error) => {
        console.log("error while deleting Item", error);
      });
  };

  const addItemToEx = async (addedItem) => {
    // TODO: UPDATE ITEM ID FROM DATABASE, after adding it to the DB

    const newItem = {
      value: addedItem,
    };

    // console.log("New item will be", newItem);
    // console.log("NOT POSITNG");
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve("FAKERESOLVE!");
    //   }, 250);
    // });

    return axResource
      .post("/AdminAddExecersiceItem", {
        exercise_id: ex._id,
        newItem: newItem,
      })
      .then((res) => {
        console.log(res);

        const newItem = {
          _id: res.data._id,
          value: addedItem,
        };
        const newEx = { ...ex };
        newEx.items.push(newItem);
        updateEx(newEx);
      })
      .catch((error) => {
        console.log("error while addming Item", error);
        alert("Couldn't add item", error);
        // updateEx(oldEx);
      });
  };

  return (
    <div>
      <BackButton />
      <h3>
        {ex.title} - {ex.description}
      </h3>

      {ex.items.map((item, i) => (
        <BlockView
          key={item._id}
          updateItem={(newItem) => {
            updateItem(newItem, i);
          }}
          deleteItem={() => deleteItem(i)}
          item={item}
        />
      ))}

      <AddBlock addItemToEx={addItemToEx} />
    </div>
  );
}

export default ExerciseView;

// TODO: add a way for admin to add images, or pure graphs
