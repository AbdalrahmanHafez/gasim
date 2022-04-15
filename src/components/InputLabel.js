import React, { useRef, useEffect, useState } from "react";
import { Input } from "antd";
import tabTypes from "../enums/tabTypes";
import { IMaskInput, IMask, IMaskMixin } from "react-imask";
import { simTypeToEmptyValue } from "../Helpers/GraphLabel";

/**
 * @param {number} tapesCtr only if simType is TM
 */
const mapSimTypeToMask = (simType, tapesCtr) => {
  if (simType === tabTypes.FA) return { mask: "*", placeholderChar: "_" };
  else if (simType === tabTypes.PDA)
    return { mask: "*{→}*{, }*", placeholderChar: "_" };
  else if (simType === tabTypes.TM)
    return {
      mask: Array(tapesCtr).fill("BASEDIR").join(" | "),
      lazy: false,
      blocks: {
        BASE: {
          mask: "*{→}*{, }",
        },
        DIR: {
          mask: IMask.MaskedEnum,
          enum: ["S", "s", "L", "l", "R", "r"],
        },
      },
    };
  else throw new Error("unkown tabType in InputLabel.js");
};

const inputStyle = {
  borderColor: "gainsboro",
  borderRadius: "3px",
  borderWidth: "1px",
  height: "2.3em",
};

const InputLabel = ({ simType, tapesCtr, ...rest }) => {
  const [value, setvalue] = useState();

  return (
    <>
      <IMaskInput
        {...mapSimTypeToMask(simType, tapesCtr)}
        style={inputStyle}
        value={value}
        unmask={true} // true|false|'typed'
        // inputRef={(el) => console.log(el)} // access to nested input
        // DO NOT USE onChange TO HANDLE CHANGES!
        // USE onAccept INSTEAD
        onAccept={
          // depending on prop above first argument is
          // `value` if `unmask=false`,
          // `unmaskedValue` if `unmask=true`,
          // `typedValue` if `unmask='typed'`
          (value, mask) => {
            const rawValue = mask.masked.rawInputValue;
            console.log(rawValue, value, mask.typedValue, mask);
            const newValue = rawValue
              .split(" ") // maybe consider anothe character than space, ex: "!"
              .join(simTypeToEmptyValue(simType));
            setvalue(newValue);
            rest.onChange(newValue); // this is handed by From.Item, for the pupropse of storing it in the form values
          }
        }
        // ...and more mask props in a guide
        lazy={false}
        placeholderChar="_"
      />
    </>
  );
};

// const InputLabel2 = ({ simType, ...rest }) => {
//   const [value, setValue] = useState("");

//   const masker = ({ masked, transform, maskDefault }) =>
//     (function () {
//       const mask = IMask.createPipe(
//         masked,
//         IMask.PIPE_TYPE.UNMASKED,
//         IMask.PIPE_TYPE.MASKED
//       );

//       const unmask = IMask.createPipe(
//         masked,
//         IMask.PIPE_TYPE.MASKED,
//         IMask.PIPE_TYPE.UNMASKED
//       );

//       const onChange = (e) => {
//         rest.onChange(e);
//         const unmasked = unmask(e.target.value);
//         const newValue = mask(unmasked);
//         e.target.value = newValue;
//         // console.log("e is", e.target.value, newValue);
//         setValue(newValue);
//       };

//       return {
//         mask,
//         onChange,
//         transform: transform || unmask,
//         unmask,
//         maskDefault: maskDefault || mask,
//       };
//     })();

//   const mymask = masker({
//     masked: mapSimTypeToMask(simType),
//   });

//   console.log("rest is", rest);

//   // return <Input {...rest} value={value} onChange={mymask.onChange} />;
//   return <Input {...rest} />;
// };

export default InputLabel;
