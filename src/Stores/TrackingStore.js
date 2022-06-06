import React from "react";

export const TrackingStoreCtx = React.createContext();

const addEvent = (e) => {
  // if (window.trackHistory === undefined) {
  //   window.trackHistory = [];
  // }
  // e.timestamp = new Date().toString();
  // window.trackHistory.push(e);
};

export const trackButtonClick = (what) => {
  addEvent({ Type: "ButtonClick", data: what });
  // console.log("TrackingStore: trackButtonClick");
};

const trackInput = (what) => {
  addEvent({ Type: "input", data: what });
  // console.log("TrackingStore: trackInput");
};

const trackChangeTab = (what) => {
  addEvent({ Type: "changeTab", data: what });
  // console.log("TrackingStore: trackChangeTab");
};

const trackEditTabs = (what) => {
  addEvent({ Type: "editTabs", data: what });
  // console.log("TrackingStore: trackEditTabs");
};

const trackContextMenuClick = (what) => {
  addEvent({ Type: "contextMenuClick", data: what });
  // console.log("TrackingStore: trackContextMenuClick");
};

const TrackingStore = ({ children }) => {
  return (
    <TrackingStoreCtx.Provider
      value={{
        trackButtonClick,
        trackInput,
        trackChangeTab,
        trackEditTabs,
        trackContextMenuClick,
      }}
    >
      {children}
    </TrackingStoreCtx.Provider>
  );
};

export default TrackingStore;
