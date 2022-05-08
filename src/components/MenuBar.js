import React, { useContext } from "react";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import FSAModel from "../Modules/FSA/FSAModel";
import { grammarExamples, machineExamples } from "../Helpers/Constatns";
import { StoreContext, UtilityContext } from "../Store";
import tabTypes from "../enums/tabTypes";
import { parseExampleLabels } from "../Helpers/GraphLabel";
import { TMModel } from "../Modules/TM";
import { GRModel } from "../Modules/GR";
import { REModel } from "../Modules/RE";
import { PDAModel } from "../Modules/PDA";
import NFAtoDFA from "../Modules/Conversion/NFAtoDFA";
import { conversionBus, eventTypes } from "../Events";
import { GRtoPDA, NFAtoRE, PDAtoGR, REtoNFA } from "../Modules/Conversion";

function MenuBar({ activeTabKey, setActiveTabKey }) {
  const [store, setStore, { addTab }] = useContext(StoreContext);

  const addUniqueLabel = (baseLabel) => {
    const existCount = store.filter((tab) =>
      tab.title.includes(baseLabel)
    ).length;
    if (existCount === 0) return baseLabel;
    return baseLabel + " " + existCount;
  };

  const handleNewMenu = (e) => {
    const { value } = e;
    switch (value) {
      case "FSA":
        addTab({
          tabType: tabTypes.FA,
          title: addUniqueLabel("Finite State Automata"),
          model: new FSAModel([]),
        });
        break;
      case "PDA":
        addTab({
          tabType: tabTypes.PDA,
          title: "Push Down Automata",
          model: new PDAModel([]),
        });
        break;
      case "TMtape1":
        addTab({
          tabType: tabTypes.TM,
          title: addUniqueLabel("Turing Machine 1T"),
          model: new TMModel([], 1),
        });
        break;
      case "TMtape2":
        addTab({
          tabType: tabTypes.TM,
          title: addUniqueLabel("Turing Machine 2T"),
          model: new TMModel([], 2),
        });
        break;
      case "TMtape3":
        addTab({
          tabType: tabTypes.TM,
          title: addUniqueLabel("Turing Machine 3T"),
          model: new TMModel([], 3),
        });
        break;
      case "TMtapeN":
        addTab({
          tabType: tabTypes.TM,
          title: addUniqueLabel("Turing Machine nt"),
          model: new TMModel([], +prompt("How many Tapes would you like?", 4)),
        });
        break;
      case "GR":
        addTab({
          tabType: tabTypes.GR,
          title: addUniqueLabel("Grammar"),
          model: new GRModel([]),
        });
        break;
      case "RE":
        addTab({
          tabType: tabTypes.RE,
          title: addUniqueLabel("Regular Expression"),
          model: new REModel(""),
        });
        break;
      default:
        throw new Error("Unknown menu item");
    }

    // make current tab, the new tab
    setActiveTabKey(store.length);
  };

  const handleConvertMenu = ({ value }) => {
    const currentTabInfo = store[activeTabKey];

    switch (value) {
      case tabTypes.NFAtoDFA:
        conversionBus.dispatch(
          eventTypes.NFAtoDFA,
          new NFAtoDFA(currentTabInfo.model)
        );
        break;

      case tabTypes.GRtoPDA:
        conversionBus.dispatch(
          eventTypes.GRtoPDA,
          new GRtoPDA(currentTabInfo.model)
        );
        break;

      case tabTypes.NFAtoRE:
        conversionBus.dispatch(
          eventTypes.NFAtoRE,
          new NFAtoRE(currentTabInfo.model)
        );
        break;

      case tabTypes.REtoNFA:
        conversionBus.dispatch(
          eventTypes.REtoNFA,
          new REtoNFA(currentTabInfo.model)
        );
        break;

      case tabTypes.PDAtoGR:
        conversionBus.dispatch(
          eventTypes.PDAtoGR,
          new PDAtoGR(currentTabInfo.model)
        );
        break;
      // addTab({
      //   title: "NFA to DFA",
      //   tabType: tabTypes.NFAtoDFA,
      //   model: new NFAtoDFA(currentTabInfo.model),
      // });

      // const newStore = [...store];
      // newStore[activeTabKey].showConversion = true;
      // newStore[activeTabKey].conversionType = conversionType.NFAtoDFA;
      // setStore(newStore);
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
      console.log("visiting edge with label", edge.data.label);
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
        addTab({ tabType: tabTypes.FA, title: "NFA example 1", model });
        break;
      }
      case "NFA2": {
        let elm2 = machineExamples.elm2;
        addLabelDataForExampleElements(elm2, tabTypes.FA);
        const model = new FSAModel(elm2);
        addTab({ tabType: tabTypes.FA, title: "NFA example 2", model });
        break;
      }
      case "NFA3": {
        let elm3 = machineExamples.elm3;
        addLabelDataForExampleElements(elm3, tabTypes.FA);
        const model = new FSAModel(elm3);
        addTab({ tabType: tabTypes.FA, title: "NFA example 3", model });
        break;
      }
      case "PDA1": {
        let elmPDA = machineExamples.elmPDA;
        console.log("elmPDA is", elmPDA);
        addLabelDataForExampleElements(elmPDA, tabTypes.PDA);
        const model = new PDAModel(elmPDA);
        addTab({ tabType: tabTypes.PDA, title: "PDA example", model });
        break;
      }
      case "TM1": {
        let elmTM2 = machineExamples.elmTM2;
        addLabelDataForExampleElements(elmTM2, tabTypes.TM);
        const model = new TMModel(elmTM2, 2);
        addTab({
          tabType: tabTypes.TM,
          title: "Turing Machine example 1",
          model,
        });
        break;
      }
      case "TM2": {
        let elmTM = machineExamples.elmTM;
        addLabelDataForExampleElements(elmTM, tabTypes.TM);
        const model = new TMModel(elmTM, 1);
        addTab({
          tabType: tabTypes.TM,
          title: "Multi tape TM example",
          model,
        });
        break;
      }
      case "TM3": {
        let elmTM3 = machineExamples.elmTM3;
        addLabelDataForExampleElements(elmTM3, tabTypes.TM);
        const model = new TMModel(elmTM3, 2);
        addTab({
          tabType: tabTypes.TM,
          title: "Enumerator example",
          model,
        });
        break;
      }
      case "GR1": {
        const model = new GRModel(grammarExamples.g1);
        addTab({
          tabType: tabTypes.GR,
          title: "Grammar example",
          model,
        });
        break;
      }
      case "RE": {
        const model = new REModel("ab*c");
        addTab({
          tabType: tabTypes.RE,
          title: "Regular Expression example",
          model,
        });
        break;
      }
      default:
        throw new Error("Unknown menu item");
    }

    // make current tab, the new tab
    setActiveTabKey(store.length);
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
        <SubMenu label="Turing Machine Automaton">
          <MenuItem value="TMtape1">Single Tape</MenuItem>
          <MenuItem value="TMtape2">Douple Tape</MenuItem>
          <MenuItem value="TMtape3">Triple Tape</MenuItem>
          <MenuItem value="TMtapeN">n-Tape</MenuItem>
        </SubMenu>
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
        <MenuItem value={tabTypes.NFAtoDFA}>NFA to DFA</MenuItem>
        <MenuItem value={tabTypes.GRtoPDA}>Grammar to PDA</MenuItem>
        <MenuItem value={tabTypes.NFAtoRE}>NFA to Regex</MenuItem>
        <MenuItem value={tabTypes.REtoNFA}>RE to NFA</MenuItem>
        <MenuItem value={tabTypes.PDAtoGR}>PDA to GR</MenuItem>
      </Menu>

      <Menu
        menuButton={
          <MenuButton style={{ border: "none", background: "transparent" }}>
            Examples
          </MenuButton>
        }
        onItemClick={handleExamplesMenu}
      >
        <SubMenu label="Finite State Machine">
          <MenuItem value="NFA1">NFA1</MenuItem>
          <MenuItem value="NFA2">NFA2</MenuItem>
          <MenuItem value="NFA3">NFA3</MenuItem>
        </SubMenu>
        <MenuItem value="PDA1">Push Down Automata</MenuItem>
        <MenuItem value="TM1">Turing Machine 1 Tape</MenuItem>
        <MenuItem value="TM2">Multi Tape TM</MenuItem>
        <MenuItem value="TM3">Enumerator</MenuItem>
        <MenuItem value="GR1">Grammar</MenuItem>
        <MenuItem value="RE">Regular Expression</MenuItem>
      </Menu>
    </div>
  );
}

export default MenuBar;
