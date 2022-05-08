export { default as NFAtoDFAComponent } from "./NFAtoDFAComponent";
export { default as NFAtoDFA } from "./NFAtoDFA";

export { default as GRtoPDAComponent } from "./GRtoPDAComponent";
export { default as GRtoPDA } from "./GRtoPDA";

export { default as NFAtoREComponent } from "./NFAtoREComponent";
export { default as NFAtoRE } from "./NFAtoRE";

/**
 * 	Conversion happes as follows
 * 	Class model for the conversion that contain the information about the convertions forex: NFAtoDFA.js
 *	if the conversion result is in a new Tab then its view is in NFAtoDFAView.js
	if the convertsion is part of another Tab then convertionBus is used, a NFAtoDFA model is passed with needed data
 */
