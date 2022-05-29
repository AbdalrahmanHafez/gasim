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

const RenderMachine = ({ info }) => {
  const cyrefFSA = useRef(null);
  const cyrefPDA = useRef(null);
  const [inputValue, setInputValue] = useState(info.string || "");

  console.log("[RenderMachine] rerendered");

  if (!info.type) return <div>Invalid Machine Description</div>;

  if (info.type === "NFA" || info.type === "DFA") {
    return (
      <div style={{ height: "25vh" }}>
        <FSAComponent
          cyref={cyrefFSA}
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    );
  }

  if (info.type === "GR") {
    return (
      <div>
        <GRComponent
          model={new GRModel(info.productions)}
          updateModel={() => {}}
        />
      </div>
    );
  }

  if (info.type === "PDA") {
    return (
      <div style={{ height: "25vh" }}>
        <PDAComponent
          cyref={cyrefPDA}
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

const RenderContent = ({ content, updateChoice, updateText }) => {
  console.log("[RenderContent] rerendered");
  const { type } = content;

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
          <h3 className="text-slate-400 italic">
            Question is of type a/an {content.question.type}
          </h3>

          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Answer" key="1">
              <RenderMachine info={content.answer} />
              <Button>Update Answer</Button>
            </Panel>
          </Collapse>
        </div>
      );

    case "stringAcceptance":
      // return <h4>STRIGACCEPTANCE</h4>;
      return (
        <div>
          <RenderMachine info={content.question} />
          <Button>Update Answer</Button>
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

  return (
    <div className="m-4 border-2 relative">
      <h3 className="absolute right-px top-px text-slate-400 z-10">
        {capitalizeFirst(content.type)}
        <Button onClick={() => {}}>edit</Button>
      </h3>
      <RenderContent
        content={content}
        updateChoice={updateChoice}
        updateText={updateText}
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
