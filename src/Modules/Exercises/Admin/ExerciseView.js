import React, { useContext, useRef } from "react";
import { Button, Radio } from "antd";
import { AdminStoreCtx } from "../../../Stores/AdminStore";
import FSAComponent from "../../FSA/FSAComponent";
import { FSAModel } from "../../FSA";
import { Collapse } from "antd";
const { Panel } = Collapse;

function RenderMachine({ info }) {
  const cyrefQ = useRef(null);
  if (!info.type) return <div>Invalid Machine Description</div>;

  if (info.type === "NFA" || info.type === "DFA") {
    return (
      <div style={{ height: "25vh" }}>
        <FSAComponent
          cyref={cyrefQ}
          model={new FSAModel(info.elements)}
          updateModel={() => {}}
        />
      </div>
    );
  }

  return <div>TODO: Still not implemented</div>;
}

function BlockView({ content }) {
  function renderContent() {
    const { type } = content;
    switch (type) {
      case "text":
        return <h4>{content.value}</h4>;

      case "choice":
        return (
          <div>
            <h4>{content.title}</h4>
            <Radio.Group buttonStyle="solid">
              {content.options.map((op, i) => (
                <Radio.Button key={i} value={op}>
                  {op}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        );

      case "equivalence":
        // return <h4>EQUIVALENCE</h4>;
        return (
          <div>
            <h3>Question is of type a/an {content.question.type}</h3>

            <Collapse>
              <Panel header="Answer" key="1">
                <RenderMachine info={content.answer} />
                <Button>Update Answer</Button>
              </Panel>
            </Collapse>
          </div>
        );
      //  return <RenderMachine info={content.question} />;

      case "stringAcceptance":
        return <h4>STRIGACCEPTANCE</h4>;

      default:
        return null;
    }

    // return <div>{"CONTNET"}</div>;
  }

  return (
    <div className="m-4 border-2">
      {/* <RenderContent /> */}
      {renderContent()}
    </div>
  );
}

function ExerciseView({ ex, updateEx }) {
  const { setViewEx } = useContext(AdminStoreCtx);

  const BackButton = () => {
    return <Button onClick={() => setViewEx(null)}>Back</Button>;
  };

  return (
    <div>
      <BackButton />
      <h3>
        {ex.title} - {ex.description}
      </h3>

      {ex.content.map((content, i) => {
        return (
          <div key={i}>
            <BlockView content={content} />
          </div>
        );
      })}
    </div>
  );
}

export default ExerciseView;
