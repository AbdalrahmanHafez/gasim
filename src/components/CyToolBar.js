import { useRef, useEffect } from "react";
import Button from "@mui/material/Button";

const CyToolBar = ({
  tbEnableAdding,
  setTbEnableAdding,
  tbEnableDeleting,
  setTbEnableDeleting,
}) => {
  return (
    <>
      <Button
        variant={tbEnableAdding ? "contained" : "outlined"}
        onClick={() => {
          setTbEnableDeleting(false);
          setTbEnableAdding(!tbEnableAdding);
        }}
      >
        Add State
      </Button>
      <Button
        variant={tbEnableDeleting ? "contained" : "outlined"}
        onClick={() => {
          setTbEnableAdding(false);
          setTbEnableDeleting(!tbEnableDeleting);
        }}
      >
        Remove
      </Button>
    </>
  );
};

export default CyToolBar;
