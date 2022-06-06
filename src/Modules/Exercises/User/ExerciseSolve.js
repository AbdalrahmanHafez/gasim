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
import { ExSolveStoreCtx } from "../../../Stores/Exercise/ExSolveStore";
import axios from "axios";
import axResource from "../../../utils/httpCommon";
import TMComponent from "../../TM/TMComponent";
import { TMModel } from "../../TM";
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

const RenderMachine = ({ info, mref }) => {
  console.log("[RenderMachine] rerendered");
  // const question = item.value.question;
  const { type } = info;

  if (type === "NFA" || type === "DFA") {
    return (
      <div style={{ height: "25vh" }}>
        <FSAComponent
          cyref={mref}
          model={new FSAModel(info.elements)}
          updateModel={() => {}}
        />
      </div>
    );
  }

  if (type === "RE") {
    return (
      <div>
        <Input ref={mref} value={info.string} />
      </div>
    );
  }

  if (type === "GR") {
    return (
      <div>
        <GRComponent
          model={new GRModel(info.productions)}
          updateModel={(newModel) => (mref.current = newModel)}
          editable={false}
        />
      </div>
    );
  }

  if (type === "PDA") {
    return (
      <div style={{ height: "25vh" }}>
        <PDAComponent
          cyref={mref}
          model={new PDAModel(info.elements)}
          updateModel={(newModel) => (mref.current = newModel)}
        />
      </div>
    );
  }

  if (type === "TM") {
    return (
      <div style={{ height: "25vh" }}>
        <TMComponent
          cyref={mref}
          model={new TMModel(info.elements, 1)}
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

const ChoiceBlock = ({ item, updateAnswer }) => {
  const [choice, setchoice] = useState("");
  return (
    <Radio.Group
      buttonStyle="solid"
      value={choice}
      onChange={(e) => {
        setchoice(e.target.value);
        updateAnswer({ type: "choice", value: e.target.value });
      }}
    >
      {item.value.options.map((op, i) => (
        <Radio.Button key={i} value={op}>
          {op}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

const EquivalenceBlock = ({ item, updateAnswer }) => {
  const mref = useRef(null);

  const Content = () => {
    console.log("[EquivalenceBlock] rerendered");

    const { type } = item.value.question;

    if (type === "NFA" || type === "DFA") {
      return (
        <div style={{ height: "25vh" }}>
          <FSAComponent
            cyref={mref}
            model={new FSAModel([])}
            updateModel={(newModel) => {
              mref.current = newModel;
              updateAnswer(
                Object.keys(newModel.elements).length === 0
                  ? null
                  : { type: type, elements: newModel.elements }
              );
            }}
          />
        </div>
      );
    }

    if (type === "RE") {
      return (
        <div>
          <Input
            ref={mref}
            onChange={(e) => {
              mref.current = e.target.value;
              updateAnswer({ type: type, string: e.target.value });
            }}
          />
        </div>
      );
    }

    if (type === "GR") {
      return (
        <div>
          <GRComponent
            model={new GRModel([["S", ""]])}
            updateModel={(newModel) => {
              mref.current = newModel;
              updateAnswer({ type: type, productions: newModel.productions });
            }}
            editable={true}
          />
        </div>
      );
    }

    if (type === "PDA") {
      return (
        <div style={{ height: "25vh" }}>
          <PDAComponent
            cyref={mref}
            model={new PDAModel([])}
            updateModel={(newModel) => {
              mref.current = newModel;
              updateAnswer(
                Object.keys(newModel.elements).length === 0
                  ? null
                  : { type: type, elements: newModel.elements }
              );
            }}
          />
        </div>
      );
    }

    return <div className="bg-red-500">Unexpected Answer Type</div>;
  };

  return (
    <div>
      <span>answer should be of type {item.value.question.type}</span>

      <Content />
    </div>
  );
};

const RenderItem = ({ item, updateAnswer }) => {
  console.log("[RenderItem] rerendered");
  const { type } = item.value;

  const cyref = useRef(null);
  const [stringvalue, setstringvalue] = useState("");

  switch (type) {
    case "text":
      return <TextBlock item={item} />;

    case "choice":
      return (
        <div>
          <ChoiceBlock item={item} updateAnswer={updateAnswer} />
        </div>
      );

    case "NFA":
      return <RenderMachine mref={cyref} info={item.value} />;

    case "DFA":
      return <RenderMachine mref={cyref} info={item.value} />;

    case "RE":
      return <RenderMachine mref={cyref} info={item.value} />;

    case "GR":
      return <RenderMachine mref={cyref} info={item.value} />;

    case "PDA":
      return <RenderMachine mref={cyref} info={item.value} />;

    case "TM":
      return <RenderMachine mref={cyref} info={item.value} />;

    case "equivalence":
      return (
        <div>
          <EquivalenceBlock item={item} updateAnswer={updateAnswer} />
        </div>
      );

    case "stringAcceptance":
      return (
        <div>
          Write a string that is{" "}
          {item.value.machine.type === "GR"
            ? "generated"
            : item.value.machine.type === "PDA"
            ? "accepted"
            : "UNKOWN MACHINE TYPE"}{" "}
          by the following {item.value.machine.type}:
          <Input
            value={stringvalue}
            onChange={(e) => {
              setstringvalue(e.target.value);
              updateAnswer({
                type: "stringAcceptance",
                string: e.target.value,
              });
            }}
          />
          <RenderMachine mref={cyref} info={item.value.machine} />
        </div>
      );

    default:
      return null;
  }
};

const BlockView = ({ item, updateAnswer }) => {
  console.log("[BLockView] rerendered");
  const { isCorrect, value } = item;

  let needsAnswer = false;
  if (
    item.value.type === "stringAcceptance" ||
    item.value.type === "equivalence" ||
    item.value.type === "choice"
  ) {
    needsAnswer = true;
  }

  return (
    <div
      className={`m-4 ${
        isCorrect === undefined || !needsAnswer
          ? ""
          : isCorrect
          ? "border-green-300 border-2 rounded-md"
          : "border-red-300 border-2 rounded-md"
      }`}
    >
      <RenderItem item={item} updateAnswer={updateAnswer} />
    </div>
  );
};

function ExerciseSolve({ ex, updateEx }) {
  console.log("[ExerciseSolve] rerendered");
  const { setView } = useContext(StoreContext);
  const { answers, setAnswers } = useContext(ExSolveStoreCtx);

  const updateAnswer = (item, answer) => {
    setAnswers((answers) => answers.set(item._id, answer));
  };

  const submitAnswers = () => {
    let finalAnswers = [];
    for (let item of ex.items) {
      // for (let [key, value] of answers.entries())
      if (answers.has(item._id)) {
        finalAnswers.push({ item_id: item._id, answer: answers.get(item._id) });
      } else {
        finalAnswers.push({ item_id: item._id, answer: null });
      }
    }
    console.log("final answers are ", finalAnswers);

    // console.log("NOT POSTING YET");

    axResource.post("/solve_exercise", finalAnswers).then((res) => {
      console.log("RES is ", res);
      for (let { item_id, isCorrect } of res.data) {
        console.log(
          `item ${item_id} is ${isCorrect ? "correct" : "incorrect"}`
        );
      }

      const newEx = { ...ex };
      newEx.items = newEx.items.map((item, i) => {
        item.isCorrect = res.data[i].isCorrect;
        return item;
      });
      updateEx(newEx);
    });
  };

  const BackButton = () => {
    return (
      <Button onClick={() => setView({ type: UserViews.EX_LIST })}>Back</Button>
    );
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
          updateAnswer={(answer) => updateAnswer(item, answer)}
          item={item}
        />
      ))}

      <div className="m-4">
        <Button block type="primary" onClick={() => submitAnswers()}>
          Submit Answers
        </Button>
      </div>
    </div>
  );
}

export default ExerciseSolve;

// TODO: add a way for admin to add images, or pure graphs
