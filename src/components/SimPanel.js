import { useEffect, useState } from "react";
const $ = window.jQuery;

const SimCard = ({ id, config }) => {
  const [, forceRender] = useState({});
  const handleStep = () => {
    console.log("handleStep");
    config.tick();
  };
  return (
    <div
      className={
        "simCard " +
        (config.winstate ? "won" : config.winstate === undefined ? "" : "lost")
      }
    >
      <div className="simCardHeader">state: {config.curState}</div>
      <div className="simCardProgress">
        {config.strDone}
        <strong>{config.strRem}</strong>
      </div>
      <div className="simCardControles">
        <button
          // onClick={() => {
          //  controller.simTick();
          // }}
          onClick={handleStep}
          className="ui-button"
          disabled={config.winstate !== undefined}
        >
          Step
        </button>

        {config.winstate !== undefined && (
          <button
            className="ui-button"
            onClick={() => {
              // controller.simReset();
            }}
          >
            reset
          </button>
        )}
      </div>
    </div>
  );
};

export default function SimPanel({ tabIdx, configs }) {
  const [simsState, setSimsState] = useState({
    shown: false,
  });

  console.log("[SimPanel] Rendered");

  useEffect(() => {
    console.log("[SimPanel] useEffect");
  }, []);

  return (
    <div id="simContainer">
      Simulation Panel
      <button
        onClick={() => {
          setSimsState((simsState) => ({ ...simsState, shown: false }));
        }}
      >
        &#10005;
      </button>
      {configs.map((config, index) => (
        <SimCard key={index} id={index} config={config} />
      ))}
      {/* <SimCard id={1} view={view} handleStep={handleStep} /> */}
    </div>
  );
}
