import React, { useContext } from "react";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import { StoreContext, UtilityContext } from "../Store";
import tabTypes from "../enums/tabTypes";

function MenuBar() {
  const { addTab } = useContext(UtilityContext);

  const handleNewMenu = (e) => {
    const { value } = e;
    switch (value) {
      case "FA":
        addTab({ tabType: tabTypes.FA, title: "NFA" });
        break;
      case "PDA":
        addTab({ tabType: tabTypes.PDA, title: "PDA" });
        break;
      case "TM":
        addTab({ tabType: tabTypes.TM, title: "NFA" });
        break;
      case "IFD":
        addTab({ tabType: tabTypes.IFD, simType: tabTypes.FA, title: "IFD" });
        break;
      default:
        break;
    }
  };

  return (
    <Menu
      menuButton={
        <MenuButton style={{ border: "none", background: "transparent" }}>
          New
        </MenuButton>
      }
      onItemClick={handleNewMenu}
    >
      <MenuItem value="FA">Finite Automaton</MenuItem>
      <MenuItem value="PDA">Push down Automaton</MenuItem>
      <MenuItem value="TM">Turing Machine Automaton</MenuItem>
      <MenuItem value="IFD">Input by Formal Definition</MenuItem>
    </Menu>
  );
}

export default MenuBar;
