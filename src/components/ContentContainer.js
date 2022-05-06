import React, { useEffect, useRef } from "react";
import tabTypes from "../enums/tabTypes";
import { FSAView } from "../Modules/FSA/";
import { PDAView } from "../Modules/PDA/";
import { IMaskInput, IMask, IMaskMixin } from "react-imask";
import { symbols } from "../Helpers/Constatns";

function ContentContainer({ tabInfo }) {
  const inputref = useRef(null);

  useEffect(() => {
    if (inputref.current === null) return;

    const maskOptions = { mask: "*{,}*{→}*", placeholderChar: "_" };

    var mask = IMask(inputref.current, maskOptions);
    mask.on("accept", () => {
      // console.log(mask.masked.format(mask.masked.value));
      console.log(mask);
      // console.log(mask.masked.extractInput(0, 3));
      console.log(
        mask.masked.state._blocks.map((b) => b.masked?._value).filter(Boolean)
      );
      // state._blocks[].masked._value
      const rawValue = mask.masked.rawInputValue;
      mask.value = rawValue.split(" ").join(symbols.epsilon);
    });
  }, [inputref]);

  const { tabType } = tabInfo;
  if (tabType === tabTypes.FA) {
    const model = tabInfo.model;
    return <FSAView model={model} />;
  }
  if (tabType === tabTypes.PDA) {
    const model = tabInfo.model;
    return <PDAView model={model} />;
  }

  return <input ref={inputref}></input>;

  return (
    <>
      <div>Empty ContentContainer</div>
    </>
  );
}

export default ContentContainer;
