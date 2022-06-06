import React, { useContext, useEffect, useRef } from "react";
import tabTypes from "../enums/tabTypes";
import { FSAView } from "../Modules/FSA/";
import { PDAView } from "../Modules/PDA/";
import { TMView } from "../Modules/TM/";
import { GRView, GRModel } from "../Modules/GR/";
import { REView } from "../Modules/RE/";
import { StoreContext } from "../Stores/Store";
import {
  GRtoPDA,
  GRtoPDAComponent,
  NFAtoDFA,
  NFAtoDFAComponent,
} from "../Modules/Conversion";
import { FSAModel } from "../Modules/FSA/";
import FSAComponent from "../Modules/FSA/FSAComponent";

function ContentContainer({ tabInfo }) {
  const { tabType } = tabInfo;

  const { Store, setStore } = useContext(StoreContext);

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
    return <PDAView model={model} updateModel={updateModel} />;
  }

  if (tabType === tabTypes.TM) {
    const model = tabInfo.model;
    return <TMView model={model} updateModel={updateModel} />;
  }

  if (tabType === tabTypes.GR) {
    const model = tabInfo.model;
    return <GRView model={model} updateModel={updateModel} />;
  }

  if (tabType === tabTypes.RE) {
    const model = tabInfo.model;
    return <REView model={model} updateModel={updateModel} />;
  }

  // return (
  //   <div>
  //     <GRtoPDAComponent model={new GRtoPDA(new GRModel([]))} editable={true} />
  //     <GRtoPDAComponent model={new GRtoPDA(new GRModel([]))} editable={false} />
  //   </div>
  // );

  // const elements = JSON.parse(
  //   '{"nodes":[{"data":{"id":"a","name":"Node A","inital":true,"final":false},"position":{"x":207.82053871202731,"y":157.50890725030382},"group":"nodes","removed":false,"selected":true,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"q4","name":"q4","inital":false,"final":false},"position":{"x":161.23938435183481,"y":31},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"b","name":"B","inital":false,"final":true},"position":{"x":334.2067615160746,"y":67.1955413038487},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"c","name":"C","inital":false,"final":false},"position":{"x":80.61151711368251,"y":161.92265862050294},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"d","name":"D","inital":false,"final":true},"position":{"x":154.66864804505076,"y":286.85373575499784},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"q5","name":"q5","inital":false,"final":false},"position":{"x":30.999999999999943,"y":289.49131427863784},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""}],"edges":[{"data":{"id":"ab","source":"a","target":"b","label":"a","labelData":"a"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"id":"ba","source":"b","target":"a","label":"b","labelData":"b"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"id":"ac","source":"a","target":"c","label":"c","labelData":"c"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"id":"cd","source":"c","target":"d","label":"d","labelData":"d"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"id":"aq4","source":"a","target":"q4","label":"a","labelData":"a"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"id":"dq5","source":"d","target":"q5","label":"ε","labelData":"ε"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""}]}'
  // );
  // return (
  //   <div>
  //     <NFAtoDFAComponent
  //       model={new NFAtoDFA(new FSAModel(elements))}
  //       updateModel={() => {}}
  //       editable={false}
  //     />

  //     <NFAtoDFAComponent
  //       model={new NFAtoDFA(new FSAModel(elements))}
  //       updateModel={() => {}}
  //       editable={false}
  //     />

  //     <NFAtoDFAComponent
  //       model={new NFAtoDFA(new FSAModel(elements))}
  //       updateModel={() => {}}
  //       editable={false}
  //     />

  //     <NFAtoDFAComponent
  //       model={new NFAtoDFA(new FSAModel(elements))}
  //       updateModel={() => {}}
  //       editable={true}
  //     />
  //   </div>
  // );

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
