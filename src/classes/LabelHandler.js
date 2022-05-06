export default class LabelHandler {
  constructor() {
    if (this.constructor === LabelHandler) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this.inputPopper = undefined;
  }

  displayInputs(edge) {
    // should attatch the inputs to the edge
    const cy = edge.cy();
    if (this.inputPopper !== undefined) return;
    let inputMasks = null; // will be set down below
    this.inputPopper = edge.popper({
      content: () => {
        let div = document.createElement("div");
        div.classList.add("popperInputContainer");

        const generatedMasks = this.getInputMasks(edge);
        inputMasks = generatedMasks;

        const inputEles = generatedMasks.map((mask) => mask.el.input);

        inputEles.forEach((ele) => div.append(ele));

        document.body.appendChild(div);
        inputEles[0].focus();
        return div;
      },
      popper: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -20],
            },
          },
        ],
      },
    });

    // inputPopper.tabType = tabType;
    // inputPopper.cy = cy;
    this.inputPopper.edge = edge;
    this.inputPopper.inputMasks = inputMasks;
  }

  handleInputOutFocus() {
    if (this.inputPopper) {
      if (this.saveInputData() === false) return;
      this.inputPopper.state.elements.popper.remove();
      this.inputPopper.destroy();
      this.inputPopper = undefined;
    }
  }

  handleESC() {
    if (this.inputPopper) {
      const storedEdge = this.inputPopper.edge;
      // that means its a new edge and should be canceld
      // otherwise its a rename action
      if (storedEdge.data("labelData") === undefined) storedEdge.remove();

      this.inputPopper.state.elements.popper.remove();
      this.inputPopper.destroy();
      this.inputPopper = undefined;
    }
  }

  saveInputData() {
    //   here method getValues
    throw new Error("Method 'saveInputData()' must be implemented.");
  }

  getInputMasksFromPopper() {
    // let values = [...this.inputPopper.state.elements.popper.children].map(
    //   (ele) => ele.value
    // );
    // return values;
    return this.inputPopper.inputMasks;
  }

  getInputMasks(edge) {
    //   should return the input elements that will be rendered
    // two cases edge label data = [undefined , has values]

    throw new Error("Method 'getinputmasks()' must be implemented.");
  }

  createIMask() {
    //   each machine should sepcify how to mask their input
    //	and how to replace space with the empty symbol
    throw new Error("Method 'createIMask()' must be implemented.");
  }

  attatchEventListeners(cy) {
    cy.on("dbltap", "edge", (e) => this.displayInputs(e.target));

    cy.on("tap pan zoom", (e) => {
      if (e.target === cy) {
        this.handleInputOutFocus();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.keyCode !== 27) return;
      console.log("ESC");
      this.handleESC();
    });

    // Creating a new edge
    cy.on("ehcomplete", (event, sourceNode, targetNode, addedEdge) => {
      this.displayInputs(addedEdge);
    });
  }
}
