import React, { useContext, useEffect, useRef } from "react";
import tabTypes from "../enums/tabTypes";
import { FSAView } from "../Modules/FSA/";
import { PDAView } from "../Modules/PDA/";
import { TMView } from "../Modules/TM/";
import { GRView } from "../Modules/GR/";
import { REView } from "../Modules/RE/";
import { StoreContext } from "../Store";

function ContentContainer({ tabInfo }) {
  const { tabType } = tabInfo;

  const [Store, setStore] = useContext(StoreContext);

  const updateModel = (newModel) => {
    // this function is here, because the Content Container knows about the current tab, finds it in the store, and updates its model
    setStore((store) => {
      const newStore = [...store];
      const storeTabInfo = newStore.filter(
        (storeTabInfo) => storeTabInfo === tabInfo
      )[0];
      storeTabInfo.model = newModel;
      return newStore;
    });
  };

  if (tabType === tabTypes.FA) {
    const model = tabInfo.model;
    return <FSAView model={model} updateModel={updateModel} />;
  }

  if (tabType === tabTypes.PDA) {
    const model = tabInfo.model;
    return <PDAView model={model} />;
  }

  if (tabType === tabTypes.TM) {
    const model = tabInfo.model;
    return <TMView model={model} />;
  }

  if (tabType === tabTypes.GR) {
    const model = tabInfo.model;
    return <GRView model={model} updateModel={updateModel} />;
  }

  if (tabType === tabTypes.RE) {
    const model = tabInfo.model;
    return <REView model={model} />;
  }

  // Conversions
  // if (tabType === tabTypes.NFAtoDFA) {
  //   const model = tabInfo.model;
  //   return <NFAtoDFAView model={model} />;
  // }

  return (
    <>
      <div>Empty ContentContainer</div>
    </>
  );
}

export default ContentContainer;
