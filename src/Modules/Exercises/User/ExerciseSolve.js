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
import { StoreContext, UserViews } from "../../../Stores/Store";
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

const RenderMachine = ({ item, mref }) => {
  console.log("[RenderMachine] rerendered");
  const question = item.value.question;

  if (question.type === "NFA" || question.type === "DFA") {
    return (
      <div style={{ height: "25vh" }}>
        <FSAComponent
          cyref={mref}
          model={new FSAModel([])}
          updateModel={() => {}}
        />
      </div>
    );
  }

  if (question.type === "RE") {
    return (
      <div>
        <Input ref={mref} onChange={(e) => (mref.current = e.target.value)} />
      </div>
    );
  }

  if (question.type === "GR") {
    return (
      <div>
        <GRComponent
          model={new GRModel([])}
          updateModel={(newModel) => (mref.current = newModel)}
          editable={true}
        />
      </div>
    );
  }

  if (question.type === "PDA") {
    return (
      <div style={{ height: "25vh" }}>
        <PDAComponent
          cyref={mref}
          model={new PDAModel([])}
          updateModel={(newModel) => (mref.current = newModel)}
        />
      </div>
    );
  }

  return <div className="bg-red-500">Unexpected Question Type</div>;
};

const TextBlock = ({ item }) => {
  return <h3>{item.value.value}</h3>;
};

const QuestionType = ({ content, updateQuestionType }) => {
  const [visiable, setvisiable] = useState(true);
  const [value, setValue] = useState(content.question.type);

  return (
    <span>
      Question is of type a/an {content.question.type}{" "}
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
            onChange={(e) => setValue(e.target.value)}
          >
            <Radio.Button value="NFA">NFA</Radio.Button>
            <Radio.Button value="DFA">DFA</Radio.Button>
            <Radio.Button value="RE">RE</Radio.Button>
          </Radio.Group>
          <Button onClick={() => updateQuestionType(value)}>save</Button>
        </>
      )}
    </span>
  );
};

const ChoiceBlock = ({ item }) => {
  const [choice, setchoice] = useState("");
  return (
    <Radio.Group
      buttonStyle="solid"
      value={choice}
      onChange={(e) => setchoice(e.target.value)}
    >
      {item.value.options.map((op, i) => (
        <Radio.Button key={i} value={op}>
          {op}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

const EquivalenceBlock = ({ item }) => {
  const mref = useRef(null);

  return <RenderMachine mref={mref} item={item} />;
};

const RenderItem = ({
  item,
  updateChoice,
  updateText,
  updateMachine,
  updateQuestionType,
}) => {
  console.log("[RenderItem] rerendered");
  const { type } = item.value;

  const cyref = useRef(null);
  const reref = useRef(null);
  const grref = useRef(null);

  switch (type) {
    case "text":
      return <TextBlock item={item} />;

    case "choice":
      return (
        <div>
          <ChoiceBlock item={item} />
        </div>
      );

    case "equivalence":
      return (
        <div>
          <EquivalenceBlock item={item} />
        </div>
      );

    case "stringAcceptance":
      return (
        <div>
          <RenderMachine
            reref={reref}
            cyref={cyref}
            grref={grref}
            info={item.machine}
          />
          <Button
            onClick={() => {
              if (item.machine.type === "GR") {
                updateMachine(grref.current.productions);
              } else if (
                item.machine.type === "NFA" ||
                item.machine.type === "DFA" ||
                item.machine.type === "PDA"
              )
                updateMachine(cyref.current.json().elements);
              else if (item.machine.type === "RE") {
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

const BlockView = ({ item, updateItem }) => {
  console.log("[BLockView] rerendered");

  const updateMachine = (newElements) => {
    // updateContent({ ...content, value: newText });
    const { type } = item;
    if (type === "equivalence") {
      // then we're updating the answer
      if (item.answer.type === "NFA" || item.answer.type === "DFA") {
        updateItem({
          ...item,
          answer: { ...item.answer, elements: newElements },
        });
      } else if (item.answer.type === "RE") {
        updateItem({
          ...item,
          answer: { ...item.answer, string: newElements },
        });
      }
    } else if (type === "stringAcceptance") {
      if (item.machine.type === "GR") {
        updateItem({
          ...item,
          machine: { ...item.machine, productions: newElements },
        });
      } else if (
        item.machine.type === "NFA" ||
        item.machine.type === "DFA" ||
        item.machine.type === "PDA"
      ) {
        updateItem({
          ...item,
          machine: { ...item.machine, elements: newElements },
        });
      } else if (item.machine.type === "RE") {
        updateItem({
          ...item,
          machine: { ...item.machine, string: newElements },
        });
      }
    }
  };

  return (
    <div className="m-4">
      <RenderItem item={item} />
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

function ExerciseSolve({ ex, updateEx }) {
  console.log("[ExerciseSolve] rerendered");
  const { setView } = useContext(StoreContext);

  const BackButton = () => {
    return (
      <Button onClick={() => setView({ type: UserViews.EX_LIST })}>Back</Button>
    );
  };

  const updateItem = (newItem, i) => {
    // i is the key
    // const newEx = { ...ex };
    // newEx.items[i] = newItem;
    // updateEx(newEx);
    // TODO: update the item inside the exersice
  };

  // const addBlockToEx = (addedContent) => {
  //   const newEx = { ...ex };
  //   newEx.content.push(addedContent);
  //   updateEx(newEx);
  // };

  return (
    <div>
      <BackButton />
      <h3>
        {ex.title} - {ex.description}
      </h3>

      {ex.items.map((item, i) => (
        <BlockView
          key={item._id}
          updateContent={(newItem) => updateItem(newItem, i)}
          item={item}
        />
      ))}

      <div className="m-4">
        <Button block type="primary" onClick={() => {}}>
          Submit Answers
        </Button>
      </div>
    </div>
  );
}

export default ExerciseSolve;

// TODO: add a way for admin to add images, or pure graphs
