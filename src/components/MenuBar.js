import React, { useContext } from "react";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import FSAModel from "../Modules/FSA/FSAModel";
import { machineExamples } from "../Helpers/Constatns";

import conversionType from "../enums/conversionType";

import { StoreContext, UtilityContext } from "../Store";
import tabTypes from "../enums/tabTypes";
import { parseExampleLabels } from "../Helpers/GraphLabel";

function MenuBar({ activeTabKey, setActiveTabKey }) {
  // const { addTab } = useContext(UtilityContext);
  const [store, setStore, { addTab }] = useContext(StoreContext);
  // TODO: addTab function interface, rest of tabtypes here and in tabType.sjs
  const handleNewMenu = (e) => {
    const { value } = e;
    switch (value) {
      case "FSA":
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
      case "GR":
        addTab({ tabType: tabTypes.GR, title: "Grammar" });
        break;
      case "RE":
        addTab({ tabType: tabTypes.RE, title: "Regular Expression" });
        break;
      default:
        throw new Error("Unknown menu item");
    }
  };

  const handleConvertMenu = ({ value }) => {
    switch (value) {
      case conversionType.NFAtoDFA:
        const newStore = [...store];
        newStore[activeTabKey].showConversion = true;
        newStore[activeTabKey].conversionType = conversionType.NFAtoDFA;
        setStore(newStore);
        break;
      default:
        throw new Error("Unknown menu item");
    }
  };

  // if (tabIdx === 0) ui.injectMachineCy(CY_ID, elm1);
  // else if (tabIdx === 1) ui.injectMachineCy(CY_ID, elm2);
  // else if (tabIdx === 2) ui.injectMachineCy(CY_ID, elm3);
  // else if (tabIdx === 3) ui.injectMachineCy(CY_ID, elmPDA);
  // else if (tabIdx === 4) ui.injectMachineCy(CY_ID, elmTM);
  // else if (tabIdx === 5) ui.injectMachineCy(CY_ID, elmTM2);
  // else if (tabIdx === 6) ui.injectMachineCy(CY_ID, elmTM3);
  // else if (tabIdx === 8) ui.injectMachineCy(CY_ID, elm8);
  const addLabelDataForExampleElements = (elements, tabType) => {
    elements.edges?.forEach((edge) => {
      edge.data = {
        ...edge.data,
        ...parseExampleLabels(edge.data.label, tabType),
      };
    });
  };
  const handleExamplesMenu = ({ value }) => {
    switch (value) {
      case "NFA1": {
        let elm1 = machineExamples.elm1;
        addLabelDataForExampleElements(elm1, tabTypes.FA);
        const model = new FSAModel(elm1);
        addTab({ tabType: tabTypes.FA, title: "NFA 1 example", model });
        break;
      }
      case "NFA2": {
        const model = new FSAModel(machineExamples.elm2);
        addTab({ tabType: tabTypes.FA, title: "NFA 2 example", model });
        break;
      }
      case "PDA1": {
        addTab({});
        break;
      }
      case "TM1": {
        addTab({});
        break;
      }
      case "TM2": {
        addTab({});
        break;
      }
      case "IFD": {
        addTab({});
        break;
      }
      case "GR1": {
        addTab({});
        break;
      }
      case "RE": {
        addTab({});
        break;
      }
      default:
        throw new Error("Unknown menu item");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Menu
        menuButton={
          <MenuButton style={{ border: "none", background: "transparent" }}>
            New
          </MenuButton>
        }
        onItemClick={handleNewMenu}
      >
        <MenuItem value="FSA">Finite State Automaton</MenuItem>
        <MenuItem value="PDA">Push down Automaton</MenuItem>
        <MenuItem value="TM">Turing Machine Automaton</MenuItem>
        <MenuItem value="IFD">Input by Formal Definition</MenuItem>
        <MenuItem value="GR">Grammar</MenuItem>
        <MenuItem value="RE">Regular Expression</MenuItem>
      </Menu>

      <Menu
        menuButton={
          <MenuButton style={{ border: "none", background: "transparent" }}>
            Convert
          </MenuButton>
        }
        onItemClick={handleConvertMenu}
      >
        <MenuItem value={conversionType.NFAtoDFA}>NFA to DFA</MenuItem>
      </Menu>

      <Menu
        menuButton={
          <MenuButton style={{ border: "none", background: "transparent" }}>
            Examples
          </MenuButton>
        }
        onItemClick={handleExamplesMenu}
      >
        <MenuItem value="NFA1">NFA1</MenuItem>
        <MenuItem value="NFA2">NFA2</MenuItem>
        <MenuItem value="PDA1">PDA1</MenuItem>
        <MenuItem value="TM1">MTTM</MenuItem>
        <MenuItem value="TM2">Enumerator</MenuItem>
        <MenuItem value="IFD">Input by Formal Definition</MenuItem>
        <MenuItem value="GR1">Grammar</MenuItem>
        <MenuItem value="RE">Regular Expression</MenuItem>
      </Menu>
    </div>
  );
}

export default MenuBar;
