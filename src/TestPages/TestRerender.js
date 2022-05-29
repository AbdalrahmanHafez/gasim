import React, { useState } from "react";

const Proplematic = React.memo(
  ({ p }) => {
    // const { st, setst } = React.useContext(Store);

    console.log("proplematic rerendered ");
    return (
      <div>
        <div>I am Proplematic {JSON.stringify(p)}</div>
        <button
          onClick={() => {
            // setst(st + 1);
          }}
        >
          inside update to store
        </button>
      </div>
    );
  },

  (prev, next) => {
    console.log("called memo", prev);
    // console.log("next is , ", next);
    return true;
  }
);

// (prev, next) => {
//     console.log("prev is , ", prev);
//     console.log("next is , ", next);
//     return true;
//   }

function TestComp() {
  const { st, setst } = React.useContext(Store);
  console.log("Parent Rerendered");

  const stProp = {};
  //   const stProp = 4;

  return (
    <div>
      <button onClick={() => setst(st + 1)}>update</button>

      {/* <Proplematic /> */}
      {new Array(4).fill(0).map((v, i) => (
        <Proplematic key={i} p={stProp} />
      ))}
    </div>
  );
}

const Store = React.createContext();

function TestRerender() {
  const [st, setst] = useState(0);

  return (
    <Store.Provider value={{ st, setst }}>
      <TestComp />
    </Store.Provider>
  );
}

export default TestRerender;
