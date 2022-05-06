import React, { useEffect, useRef } from "react";
import tabTypes from "../enums/tabTypes";
import { FSAView } from "../Modules/FSA/";
import { PDAView } from "../Modules/PDA/";
import { TMView } from "../Modules/TM/";
import { IMaskInput, IMask, IMaskMixin } from "react-imask";
import { symbols } from "../Helpers/Constatns";

function ContentContainer({ tabInfo }) {
  const { tabType } = tabInfo;

  if (tabType === tabTypes.FA) {
    const model = tabInfo.model;
    return <FSAView model={model} />;
  }
  if (tabType === tabTypes.PDA) {
    const model = tabInfo.model;
    return <PDAView model={model} />;
  }
  if (tabType === tabTypes.TM) {
    const model = tabInfo.model;
    return <TMView model={model} />;
  }

  return (
    <>
      <div>Empty ContentContainer</div>
    </>
  );
}

export default ContentContainer;
