import React, { useEffect, useContext, useState } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import Button from "@mui/material/Button";
import ContentContainer from "./ContentContainer";
import SimPanel from "./SimPanel";
import { StoreContext, UtilityContext } from "../Store";
import "antd/dist/antd.css";

import { Tabs } from "antd";
const { TabPane } = Tabs;

const $ = window.jQuery;
function mapTabIdxToInfo(tabIdx) {
  // TODO: dynamic tabs
  switch (tabIdx) {
    case 0:
      return { info: "Try inputs: a, abc, abcd, abcde " };
    case 1:
      return { info: "Try inputs: '', a, ab, abc " };
    case 2:
      return { info: "Try inputs: '', a, ab, abc " };
    case 3:
      return { info: "Try inputs: '', a, ab, abc " };
    case 4:
      return { info: "Try inputs: [a, a] [aa, aa] " };
    case 5:
      return { info: "Try inputs: a, aa" };
    case 6:
      return { info: "Try inputs: '' (empty)" };

    default:
      return { info: "Tab " + tabIdx };
  }
}
export default function TabsController({ activeTabKey, setActiveTabKey }) {
  const [store, setstore] = useContext(StoreContext);
  const { addTab } = useContext(UtilityContext);

  // const tabs = useStoreState((state) => state.tabs);
  // const activeTab = useStoreState((state) => state.activeTab);

  // const activateTab = useStoreActions((actions) => actions.activateTab);
  // const startSimulation = useStoreActions((actions) => actions.startSimulation);

  /**
   *
   * @param {function|Object} something function like set state, or object to set
   * @param {Number} tabIndex will be automatically filled, children don't need to worry about it
   */
  const setInfo = (something, tabIndex) => {
    const curTabInfo = store[tabIndex];
    const newInfo =
      typeof something === "function" ? something(curTabInfo) : something;
    setstore((prev) => {
      const newstore = [...prev];
      newstore[tabIndex] = newInfo;
      return newstore;
    });
  };

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
        activeKey={activeTabKey.toString()}
        onChange={(nKey) => setActiveTabKey(+nKey)}
        style={{ margin: "0px 7px" }}
      >
        {store.map((tab, index) => {
          // TODO: Dynamic Tabs
          const tempDataTab = mapTabIdxToInfo(index);
          const info = store[index];

          return (
            <TabPane tab={info.title} key={index}>
              <div id={"tab-" + index}>
                {tempDataTab.info}
                <ContentContainer
                  tabIdx={index}
                  tabInfo={info}
                  setTabInfo={(something) => setInfo(something, index)}
                />
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    </>
  );
}
