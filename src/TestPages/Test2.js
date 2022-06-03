import React from "react";

function Test2() {
  return (
    <div>
      <h1>Test2</h1>

      <button
        onClick={() => {
          throw new Error("Something is wrong 1+1");
        }}
      >
        throw an error
      </button>
    </div>
  );
}

export default Test2;
