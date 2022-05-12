export default class GRtoPDA {
  constructor(GRModel) {
    this.GRModel = GRModel;
    this.dstCy = null;
  }

  get exportResult() {
    return this.dstCy.json().elements;
  }

  convert(dstCy) {
    this.dstCy = dstCy;
    const dataToProductions = (data) => data.map((row) => [row.from, row.to]);

    const getRHSTerminals = (productions) => {
      const terminals = new Set();
      const rhs = productions
        .map((p) => p[1])
        .join("")
        .split("");

      rhs.forEach((char) => {
        if (char.toLowerCase() === char && char !== " ") terminals.add(char);
      });
      return Array.from(terminals);
    };
    console.log("Converting.");
    // TODO: Fix the constant labelData
    // const cy = ui.getCy();

    const terminalTransitions = getRHSTerminals(this.GRModel.productions).map(
      (terminal) => ({
        data: {
          id: "q" + terminal,
          source: "q1",
          target: "q1",
          // label: "ε, Z; ε",
          label: `${terminal}, ${terminal}; ε`,
          labelData: { symbol: terminal, pop: terminal, push: "ε" },
        },
      })
    );

    const productionTransitions = this.GRModel.productions.map((production) => {
      let [from, to] = production;
      to = to === " " ? "ε" : to;
      return {
        data: {
          id: `q${from}${to}`,
          source: "q1",
          target: "q1",
          label: `ε, ${from}; ${to}`,
          labelData: { symbol: "ε", pop: from, push: to },
        },
      };
    });

    dstCy.add({
      nodes: [
        {
          data: { id: "q0", name: "q0", inital: true, final: false },
        },
        {
          data: { id: "q1", name: "q1", inital: false, final: false },
        },
        {
          data: { id: "q2", name: "q2", inital: false, final: true },
        },
      ],
      edges: [
        {
          data: {
            id: "q0q1",
            source: "q0",
            target: "q1",
            label: "ε, Z; SZ",
            labelData: { symbol: "ε", pop: "Z", push: "SZ" },
          },
        },
        {
          data: {
            id: "q1q2",
            source: "q1",
            target: "q2",
            label: "ε, Z; ε",
            labelData: { symbol: "ε", pop: "Z", push: "ε" },
          },
        },
        ...terminalTransitions,
        ...productionTransitions,
      ],
    });

    dstCy.layout({ name: "cose" }).run();
  }
}
