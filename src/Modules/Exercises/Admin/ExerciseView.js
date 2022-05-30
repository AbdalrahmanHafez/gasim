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
import { changeConfirmLocale } from "antd/lib/modal/locale";
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

const RenderMachine = ({ info, cyref, reref, grref }) => {
  // const cyrefFSA = useRef(null);
  // const cyrefPDA = useRef(null);
  const [inputValue, setInputValue] = useState(info.string || "");

  console.log("[RenderMachine] rerendered");

  if (!info.type) return <div>Invalid Machine Description</div>;

  if (info.type === "NFA" || info.type === "DFA") {
    return (
      <div style={{ height: "25vh" }}>
        <FSAComponent
          cyref={cyref}
          model={new FSAModel(info.elements)}
          updateModel={() => {}}
        />
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
      </div>
    );
  }

  if (info.type === "GR") {
    return <GrammarBlock grref={grref} info={info} />;
  }

  if (info.type === "PDA") {
    return (
      <div style={{ height: "25vh" }}>
        <PDAComponent
          cyref={cyref}
          model={new PDAModel(info.elements)}
          updateModel={() => {}}
        />
      </div>
    );
  }

  return <div className="bg-red-500">Unexpected</div>;
};

const TextBlock = ({ content, updateText }) => {
  const [inputValue, setInputValue] = useState(content.value || null);
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
      {visiable && <Button onClick={() => updateText(inputValue)}>Save</Button>}
    </div>
  );
};

const QuestionType = ({ content, updateQuestionType }) => {
  const [visiable, setvisiable] = useState(true);
  const [value, setValue] = useState(content.question.type);

  return (
    <h3 className="text-slate-400">
      Question is of type a/an {content.question.type}{" "}
      {visiable ? (
        <strong onClick={() => setvisiable(false)}>change</strong>
      ) : (
        <>
          <Radio.Group
            value={value}
            buttonStyle="solid"
            onChange={(e) => setValue(e.target.value)}
          >
            <Radio.Button value="NFA">NFA</Radio.Button>
            <Radio.Button value="DFA">DFA</Radio.Button>
            <Radio.Button value="RE">RE</Radio.Button>
          </Radio.Group>
          <Button onClick={() => updateQuestionType(value)}>save</Button>
        </>
      )}
    </h3>
  );
};

const RenderContent = ({
  content,
  updateChoice,
  updateText,
  updateMachine,
  updateQuestionType,
}) => {
  console.log("[RenderContent] rerendered");
  const { type } = content;
  const cyref = useRef(null);
  const reref = useRef(null);
  const grref = useRef(null);

  switch (type) {
    case "text":
      return <TextBlock content={content} updateText={updateText} />;

    case "choice":
      return (
        <div>
          <Radio.Group
            buttonStyle="solid"
            value={content.answer}
            onChange={updateChoice}
          >
            {content.options.map((op, i) => (
              <Radio.Button key={i} value={op}>
                {op}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      );

    case "equivalence":
      return (
        <div>
          <QuestionType
            content={content}
            updateQuestionType={updateQuestionType}
          />

          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Answer" key="1">
              <RenderMachine
                reref={reref}
                cyref={cyref}
                info={content.answer}
              />
              <Button
                onClick={() => {
                  if (content.answer.type === "RE") {
                    updateMachine(reref.current.input.value);
                  } else updateMachine(cyref.current.json().elements);
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
            reref={reref}
            cyref={cyref}
            grref={grref}
            info={content.machine}
          />
          <Button
            onClick={() => {
              if (content.machine.type === "GR") {
                updateMachine(grref.current.productions);
              } else if (
                content.machine.type === "NFA" ||
                content.machine.type === "DFA" ||
                content.machine.type === "PDA"
              )
                updateMachine(cyref.current.json().elements);
              else if (content.machine.type === "RE") {
                updateMachine(reref.current.input.value);
              }
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

const BlockView = ({ content, updateContent }) => {
  console.log("[BLockView] rerendered");

  const updateChoice = (e) => {
    const newChoice = e.target.value;
    updateContent({ ...content, answer: newChoice });
  };

  const updateText = (newText) => {
    updateContent({ ...content, value: newText });
  };

  const updateQuestionType = (newType) => {
    updateContent({
      ...content,
      question: { ...content.question, type: newType },
    });
  };

  const updateMachine = (newElements) => {
    // updateContent({ ...content, value: newText });
    const { type } = content;
    if (type === "equivalence") {
      // then we're updating the answer
      if (content.answer.type === "NFA" || content.answer.type === "DFA") {
        updateContent({
          ...content,
          answer: { ...content.answer, elements: newElements },
        });
      } else if (content.answer.type === "RE") {
        updateContent({
          ...content,
          answer: { ...content.answer, string: newElements },
        });
      }
    } else if (type === "stringAcceptance") {
      if (content.machine.type === "GR") {
        updateContent({
          ...content,
          machine: { ...content.machine, productions: newElements },
        });
      } else if (
        content.machine.type === "NFA" ||
        content.machine.type === "DFA" ||
        content.machine.type === "PDA"
      ) {
        updateContent({
          ...content,
          machine: { ...content.machine, elements: newElements },
        });
      } else if (content.machine.type === "RE") {
        updateContent({
          ...content,
          machine: { ...content.machine, string: newElements },
        });
      }
    }
  };

  return (
    <div className="m-4  relative">
      <h3 className="absolute right-2 top-px text-slate-400 z-10">
        {capitalizeFirst(content.type)}
      </h3>
      <RenderContent
        content={content}
        updateChoice={updateChoice}
        updateText={updateText}
        updateMachine={updateMachine}
        updateQuestionType={updateQuestionType}
      />
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

function RenderNewBlock({ blockType, setSaveObject }) {
  const [textValue, setTextValue] = useState("");

  const [numberChoices, setNumberChoices] = useState(2);
  const [selectedChoice, setSelectedChoice] = useState(0);
  const radref = useRef(null);

  const [questionType, setquestionType] = useState("DFA");
  const [answerType, setanswerType] = useState("DFA");
  const [answer, setanswer] = useState(null);
  const cyref = useRef(null);
  const [inputValue, setInputValue] = useState("");

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
              setSaveObject(e.target.value);
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
          answer: options[selectedChoice],
        };

        setSaveObject(finalObject);
        // [...temp1.current.querySelectorAll('input[type="radio"]')].map(e=>e.checked)
        // [...temp1.current.querySelectorAll('input[type="text"]')].map(e=>e.value)

        // radref.current.querySelectorAll('input[type="radio"]')
        // setSaveObject()
      };

      return (
        <div>
          <InputNumber
            min={2}
            value={numberChoices}
            onChange={(nc) => setNumberChoices(nc)}
          />

          <Radio.Group
            ref={radref}
            value={selectedChoice}
            onChange={(e) => {
              setSelectedChoice(e.target.value);
              saveChoices();
            }}
          >
            {new Array(numberChoices).fill(0).map((_, i) => (
              <Radio key={i} value={i}>
                <FreeInput onChange={saveChoices} />
              </Radio>
            ))}
          </Radio.Group>
        </div>
      );

    case "equivalence":
      const saveData = () => {
        const finalObject = {
          type: "equivalence",
          question: {
            type: questionType,
          },
          answer: {
            type: answerType,
            [answerType === "RE" ? "string" : "elements"]:
              answerType === "RE"
                ? inputValue
                : cyref.current?.json?.().elements,
          },
        };
        setSaveObject(finalObject);
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
                  model={new FSAModel([])}
                  updateModel={() => saveData()}
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
        const finalObject = {
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
        setSaveObject(finalObject);
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

const AddBlock = ({ addBlockToEx }) => {
  const [bool, setbool] = useState(true);
  const [blockType, setBlockType] = useState(null);

  const savedObject = useRef(null);

  const resetState = () => {
    setbool(true);
    setBlockType(null);
  };

  const handleSaveBlock = () => {
    switch (blockType) {
      case "text":
        addBlockToEx({
          type: blockType,
          value: savedObject.current,
        });
        break;

      case "choice":
        addBlockToEx(savedObject.current);
        break;

      case "equivalence":
        addBlockToEx(savedObject.current);
        break;

      case "stringAcceptance":
        addBlockToEx(savedObject.current);
        break;

      default:
        break;
    }

    resetState();
  };

  const setSaveObject = (saveObject) => {
    savedObject.current = saveObject;
  };

  if (blockType) {
    return (
      <div>
        <RenderNewBlock blockType={blockType} setSaveObject={setSaveObject} />
        <Button onClick={() => handleSaveBlock()}> Save Block</Button>
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

  const BackButton = () => {
    return (
      <Button onClick={() => setView({ type: AdminViews.LIST_ALL })}>
        Back
      </Button>
    );
  };

  const updateContent = (newContent, i) => {
    // i is the key
    const newEx = { ...ex };
    newEx.content[i] = newContent;
    updateEx(newEx);
  };

  const addBlockToEx = (addedContent) => {
    const newEx = { ...ex };
    newEx.content.push(addedContent);
    updateEx(newEx);
  };

  return (
    <div>
      <BackButton />
      <h3>
        {ex.title} - {ex.description}
      </h3>

      {ex.content.map((content, i) => (
        <BlockView
          key={content.id}
          updateContent={(newContent) => {
            updateContent(newContent, i);
          }}
          content={content}
        />
      ))}

      <AddBlock addBlockToEx={addBlockToEx} />
    </div>
  );
}

export default ExerciseView;
