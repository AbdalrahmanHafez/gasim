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
        defaultActiveKey={"0"}
        onChange={callback}
        style={{ margin: "0px 7px" }}
      >
        {store.map((tab, index) => (
          <TabPane tab={"Tab " + index} key={index}>
            <div id={"tab-" + index}>
              Tab {index}
              <ContentContainer tabIdx={index} info={store[index]} />
            </div>
          </TabPane>
        ))}
      </Tabs>
    </>
  );
}
