import React, { useContext } from "react";
import { Button, Radio } from "antd";
import { AdminStoreCtx } from "../../Stores/AdminStore";

function BlockView({ content }) {
  function renderContent() {
    console.log("contenr is ", content);
    const { type } = content;
    switch (type) {
      case "text":
        return <h4>content.value</h4>;

      case "choice":
        return (
          <div>
            <h4>{content.title}</h4>
            <Radio.Group buttonStyle="solid">
              {content.options.map((op) => (
                <Radio.Button value={op}>{op}</Radio.Button>
              ))}
            </Radio.Group>
          </div>
        );

      default:
        return null;
    }

    // return <div>{"CONTNET"}</div>;
  }

  return (
    <div className="mb-4 round border-2 border-slate-700 bg-slate-200">
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
