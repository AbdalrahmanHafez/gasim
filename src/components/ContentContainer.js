import React from "react";
import tabTypes from "../enums/tabTypes";
import FSAView from "../Modules/FSA/FSAView";

function ContentContainer({ tabInfo }) {
  const { tabType } = tabInfo;
  if (tabType === tabTypes.FA) {
    const model = tabInfo.model;
    return <FSAView model={model} />;
  }
  return <div>ContentContainer</div>;
}

export default ContentContainer;
