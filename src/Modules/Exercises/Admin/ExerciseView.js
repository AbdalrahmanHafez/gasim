import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { Input, Button, Radio } from "antd";
import { AdminStoreCtx } from "../../../Stores/AdminStore";
import { capitalizeFirst } from "../../../utils";
import { FSAComponent, FSAModel } from "../../FSA";
import { PDAModel, PDAComponent } from "../../PDA";
import { GRComponent, GRModel } from "../../GR";
import { Collapse } from "antd";
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

  return <div className="bg-red-500">TODO: Still not implemented</div>;
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
          <h4>{content.title}</h4>
          {"Answer"}{" "}
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
    <div className="m-4 border-2 relative">
      <h3 className="absolute right-px top-px text-slate-400 z-10">
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

function ExerciseView({ ex, updateEx }) {
  const { setViewEx } = useContext(AdminStoreCtx);
  console.log("[ExerciseView] rerendered");

  const BackButton = () => {
    return <Button onClick={() => setViewEx(null)}>Back</Button>;
  };

  const updateContent = (newContent, i) => {
    // i is the key
    const newEx = { ...ex };
    newEx.content[i] = newContent;
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

      <Button block>Add Block</Button>
    </div>
  );
}

export default ExerciseView;
