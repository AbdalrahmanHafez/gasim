import React, { useEffect, useContext } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import Button from "@mui/material/Button";
import ContentContainer from "./ContentContainer";
import { StoreContext } from "../Store.js";
import SimPanel from "./SimPanel";
import "antd/dist/antd.css";

import { Tabs } from "antd";
const { TabPane } = Tabs;

const $ = window.jQuery;

export default function TabsController() {
  const [store, setstore] = useContext(StoreContext);

  // const tabs = useStoreState((state) => state.tabs);
  // const activeTab = useStoreState((state) => state.activeTab);

  // const activateTab = useStoreActions((actions) => actions.activateTab);
  // const startSimulation = useStoreActions((actions) => actions.startSimulation);

  function callback(key) {
    console.log("Changing active tab to key=" + key);
  }

  console.log("[TabsController] Rendered");

  return (
    <Tabs
      defaultActiveKey={"0"}
      onChange={callback}
      style={{ margin: "0px 7px" }}
    >
      {store.map((tab, index) => (
        <TabPane tab={"Tab " + index} key={index}>
          <div id={"tab-" + index}>
            Tab {index}
            <ContentContainer tabIdx={index} />
          </div>
        </TabPane>
      ))}
    </Tabs>
  );
}
