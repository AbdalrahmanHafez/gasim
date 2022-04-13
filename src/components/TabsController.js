import React, { useEffect, useContext } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import Button from "@mui/material/Button";
import ContentContainer from "./ContentContainer";
import SimPanel from "./SimPanel";
import { StoreContext, UtilityContext } from "../Store";
import "antd/dist/antd.css";

import { Tabs } from "antd";
const { TabPane } = Tabs;

const $ = window.jQuery;
function mapTabIdxToNameAndInfo(tabIdx) {
  // TODO: dynamic tabs
  switch (tabIdx) {
    case 0:
      return { label: "NFA 1", info: "Try inputs: a, abc, abcd, abcde " };
    case 1:
      return { label: "NFA 2", info: "Try inputs: '', a, ab, abc " };
    case 2:
      return { label: "NFA 3", info: "Try inputs: '', a, ab, abc " };
    case 3:
      return { label: "PDA", info: "Try inputs: '', a, ab, abc " };
    case 4:
      return { label: "MTTM", info: "Try inputs: [a, a] [aa, aa] " };
    case 5:
      return { label: "TM", info: "Try inputs: a, aa" };
    case 6:
      return { label: "Enum", info: "Try inputs: '' (empty)" };

    default:
      return { label: "Tab " + tabIdx, info: "Tab " + tabIdx };
  }
}
export default function TabsController() {
  const [store, setstore] = useContext(StoreContext);
  const { addTab } = useContext(UtilityContext);

  // const tabs = useStoreState((state) => state.tabs);
  // const activeTab = useStoreState((state) => state.activeTab);

  // const activateTab = useStoreActions((actions) => actions.activateTab);
  // const startSimulation = useStoreActions((actions) => actions.startSimulation);

  // const setinfo = (something) => {
  //   const newInfo =
  //     typeof something === "function" ? something(info) : something;
  //   setstore((prev) => {
  //     const newstore = [...prev];
  //     newstore[tabIdx] = newInfo;
  //     return newstore;
  //   });
  // };

  function callback(key) {
    console.log("Changing active tab to key=" + key);
  }

  console.log("[TabsController] Rendered");
  // TODO: ADD tab add tabtype

  return (
    <>
      <Button
        style={{
          position: "absolute",
          top: "45px",
          right: "0",
          zIndex: 2,
        }}
        onClick={addTab}
      >
        Add Tab
      </Button>
      <Tabs
        defaultActiveKey={"7"}
        onChange={callback}
        style={{ margin: "0px 7px" }}
      >
        {store.map((tab, index) => {
          // TODO: Dynamic Tabs
          const tempDataTab = mapTabIdxToNameAndInfo(index);
          return (
            <TabPane tab={tempDataTab.label} key={index}>
              <div id={"tab-" + index}>
                {tempDataTab.info}
                <ContentContainer tabIdx={index} info={store[index]} />
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
}
