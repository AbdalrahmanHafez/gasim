import SimEngine from "./classes/Config";
import { action, thunk } from "easy-peasy";
import cytoscape from "cytoscape";
import popper from "cytoscape-popper";
import edgehandles from "cytoscape-edgehandles";
import contextMenus from "cytoscape-context-menus";

const model = {
  tabs: [{ name: "tab-0", showSim: true, simObj: undefined }],
  activeTab: 0,

  addTab: action((state, payload) => {
    const tabNr = state.tabs.length;
    state.tabs.push(payload);
    state.activeTab = tabNr; //Activate the tab
  }),

  activateTab: action((state, nr) => {
    state.activeTab = nr;
  }),
};

export default model;
