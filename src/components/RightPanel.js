import React from "react";

function RightPanel({ setShowPanel, onClose, children }) {
  const handleCloseBtn = () => {
    if (onClose) {
      onClose();
    }
    setShowPanel(false);
  };
  return (
    <div id="rightPaneContainer">
      <button id="btnCloseSim" onClick={handleCloseBtn}>
        &#10005;
      </button>
      {children}
    </div>
  );
}

export default RightPanel;
