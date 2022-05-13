// export const baseurl = "https://e5cb-102-43-162-25.ngrok.io/";
export const baseurl = "http://localhost:5050/";

export const symbols = {
  epsilon: "ε",
  lamda: "λ",
  empty: "Ø",
  rectangle: "▢",
  arrow: "→",
  blank_replacement_tm_tape: "\\",
};
Object.freeze(symbols);

export class machineExamples {
  static get empty() {
    return {
      nodes: [],
      edges: [],
    };
  }

  static get elm1() {
    return {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
          position: { x: 0, y: 0 },
          selected: true,
          locked: false,
        },
        {
          data: { id: "q4", name: "q4", inital: false, final: false },
        },
        {
          data: { id: "b", name: "B", inital: false, final: true },
          parent: "a",
          position: { x: 100, y: 100 },
          renderedPosition: { x: 100, y: 100 },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
          parent: "a",
        },
        { data: { id: "d", name: "D", inital: false, final: true } },
        { data: { id: "q5", name: "q5", inital: false, final: false } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "ba", source: "b", target: "a", label: "b" } },
        { data: { id: "ac", source: "a", target: "c", label: "c" } },
        { data: { id: "cd", source: "c", target: "d", label: "d" } },
        { data: { id: "aq4", source: "a", target: "q4", label: "a" } },
        { data: { id: "dq5", source: "d", target: "q5", label: "ε" } },
      ],
    };
  }

  static get elm2() {
    return {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
        },
        {
          data: { id: "f", name: "F", inital: false, final: false },
        },
        {
          data: { id: "w", name: "W", inital: false, final: true },
        },
        {
          data: { id: "g", name: "G", inital: false, final: false },
        },
        {
          data: { id: "h", name: "H", inital: false, final: true },
        },
        {
          data: { id: "b", name: "B", inital: false, final: false },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
        },
        {
          data: { id: "d", name: "D", inital: false, final: false },
        },
        { data: { id: "e", name: "E", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "af", source: "a", target: "f", label: "ε" } },
        { data: { id: "fg", source: "f", target: "g", label: "a" } },
        { data: { id: "fw", source: "f", target: "w", label: "ε" } },
        { data: { id: "gh", source: "g", target: "h", label: "b" } },
        { data: { id: "bc", source: "b", target: "c", label: "ε" } },
        { data: { id: "cd", source: "c", target: "d", label: "ε" } },
        { data: { id: "db", source: "d", target: "b", label: "ε" } },
        { data: { id: "de", source: "d", target: "e", label: "b" } },
      ],
    };
  }

  static get elm3() {
    return {
      nodes: [
        {
          data: {
            id: "a",
            name: "Node A",
            inital: true,
            final: false,
          },
        },
        {
          data: { id: "b", name: "B", inital: false, final: false },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
        },
        {
          data: { id: "d", name: "D", inital: false, final: false },
        },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "a" } },
        { data: { id: "bb", source: "b", target: "b", label: "ε" } },
        { data: { id: "bc", source: "b", target: "c", label: "ε" } },
        { data: { id: "cd", source: "c", target: "d", label: "b" } },
      ],
    };
  }

  static get elmPDA() {
    return {
      nodes: [
        {
          data: { id: "a", name: "Node A", inital: true, final: false },
        },
        {
          data: { id: "f", name: "F", inital: false, final: false },
        },
        {
          data: { id: "w", name: "W", inital: false, final: true },
        },
        {
          data: { id: "g", name: "G", inital: false, final: false },
        },
        {
          data: { id: "h", name: "H", inital: false, final: true },
        },
        {
          data: { id: "b", name: "B", inital: false, final: false },
        },
        {
          data: { id: "c", name: "C", inital: false, final: false },
        },
        {
          data: { id: "d", name: "D", inital: false, final: false },
        },
        { data: { id: "e", name: "E", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "aZX" } },
        { data: { id: "af", source: "a", target: "f", label: "εεS" } },
        { data: { id: "fg", source: "f", target: "g", label: "aεε" } },
        { data: { id: "fw", source: "f", target: "w", label: "εSK" } },
        { data: { id: "gh", source: "g", target: "h", label: "bSε" } },
        { data: { id: "bc", source: "b", target: "c", label: "εεε" } },
        { data: { id: "cd", source: "c", target: "d", label: "εεε" } },
        { data: { id: "db", source: "d", target: "b", label: "εεε" } },
        { data: { id: "de", source: "d", target: "e", label: "bXε" } },
      ],
    };
  }
  static get elmTM() {
    return {
      nodes: [
        {
          data: { id: "a", inital: true, final: false },
        },
        {
          data: { id: "b", inital: false, final: false },
        },
        {
          data: { id: "c", inital: false, final: false },
        },
        { data: { id: "d", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "aaR|abR" } },
        { data: { id: "ba", source: "b", target: "a", label: "▢bR|▢cR" } },
        { data: { id: "bc", source: "b", target: "c", label: "aaR|acR" } },
        { data: { id: "bd", source: "b", target: "d", label: "abR|akR" } },
      ],
    };
  }
  static get elmTM2() {
    return {
      nodes: [
        {
          data: { id: "a", inital: true, final: false },
        },
        {
          data: { id: "b", inital: false, final: false },
        },
        {
          data: { id: "c", inital: false, final: false },
        },
        { data: { id: "d", inital: false, final: true } },
      ],
      edges: [
        { data: { id: "ab", source: "a", target: "b", label: "aaR" } },
        { data: { id: "ba", source: "b", target: "a", label: "▢bR" } },
        { data: { id: "bc", source: "b", target: "c", label: "aaR" } },
        { data: { id: "bd", source: "b", target: "d", label: "abR" } },
      ],
    };
  }

  static get elmTM3() {
    return {
      nodes: [
        {
          data: { id: "q0", inital: true, final: false },
        },
        {
          data: { id: "q1", inital: false, final: false },
        },
        {
          data: { id: "q2", inital: false, final: false },
        },
        { data: { id: "q3", inital: false, final: false } },
        { data: { id: "q4", inital: false, final: false } },
        { data: { id: "q5", inital: false, final: false } },
        { data: { id: "q6", inital: false, final: false } },
      ],
      edges: [
        { data: { id: "q0q1", source: "q0", target: "q1", label: "▢▢R|▢▢R" } },
        { data: { id: "q1q2", source: "q1", target: "q2", label: "▢#R|▢aS" } },
        { data: { id: "q2q3", source: "q2", target: "q3", label: "▢#R|aaS" } },
        { data: { id: "q3q3", source: "q3", target: "q3", label: "▢aR|aaR" } },
        { data: { id: "q3q4", source: "q3", target: "q4", label: "▢▢S|▢▢L" } },
        { data: { id: "q4q4", source: "q4", target: "q4", label: "▢bR|aaL" } },
        { data: { id: "q4q5", source: "q4", target: "q5", label: "▢▢S|▢▢R" } },
        { data: { id: "q5q5", source: "q5", target: "q5", label: "▢cR|aaR" } },
        { data: { id: "q5q6", source: "q5", target: "q6", label: "▢▢S|▢aL" } },
        { data: { id: "q6q6", source: "q6", target: "q6", label: "▢▢S|aaL" } },
        { data: { id: "q6q3", source: "q6", target: "q3", label: "▢#R|▢▢R" } },
      ],
    };
  }

  static get elm8() {
    return {
      nodes: [
        {
          data: { id: "q4", name: "q4", inital: true, final: false },
        },
        {
          data: { id: "q6", name: "q6", inital: false, final: false },
        },
        {
          data: { id: "q5", name: "q5", inital: false, final: false },
        },
        {
          data: { id: "q7", name: "q7", inital: false, final: false },
        },
        {
          data: { id: "q0", name: "q0", inital: false, final: false },
        },
        {
          data: { id: "q1", name: "q1", inital: false, final: false },
        },
        {
          data: { id: "q3", name: "q3", inital: false, final: false },
        },
        {
          data: { id: "q2", name: "q2", inital: false, final: false },
        },
      ],
      edges: [
        { data: { id: "q4q6", source: "q4", target: "q6", label: "k" } },
        { data: { id: "q4q5", source: "q4", target: "q5", label: "a" } },
        { data: { id: "q5q7", source: "q5", target: "q7", label: "b" } },
        { data: { id: "q7q4", source: "q7", target: "q4", label: "s" } },
        { data: { id: "q4q0", source: "q4", target: "q0", label: "ε" } },
        { data: { id: "q0q1", source: "q0", target: "q1", label: "a" } },
        { data: { id: "q1q0", source: "q1", target: "q0", label: "w" } },
        { data: { id: "q7q1", source: "q7", target: "q1", label: "a" } },
        { data: { id: "q1q3", source: "q1", target: "q3", label: "ε" } },
        { data: { id: "q0q2", source: "q0", target: "q2", label: "a" } },
        { data: { id: "q2q3", source: "q2", target: "q3", label: "c" } },
      ],
    };
  }

  static get elmFSAtoRE() {
    return {
      nodes: [
        {
          data: { id: "q0", name: "q0", inital: true, final: false },
        },
        {
          data: { id: "q1", name: "q1", inital: false, final: false },
        },
        {
          data: { id: "q3", name: "q3", inital: false, final: false },
        },
        {
          data: { id: "q2", name: "q2", inital: false, final: false },
        },
        {
          data: { id: "q4", name: "q4", inital: false, final: true },
        },
      ],
      edges: [
        { data: { id: "q0q1", source: "q0", target: "q1", label: "a" } },
        { data: { id: "q1q3", source: "q1", target: "q3", label: "b" } },
        { data: { id: "q1q2", source: "q1", target: "q2", label: "c" } },
        { data: { id: "q3q4", source: "q3", target: "q4", label: "d" } },
        { data: { id: "q2q4", source: "q2", target: "q4", label: "d" } },
      ],
    };
  }

  static get elmPDAtoGR() {
    return {
      nodes: [
        {
          data: { id: "q0", name: "q0", inital: true, final: false },
        },
        {
          data: { id: "q1", name: "q1", inital: false, final: false },
        },
        {
          data: { id: "q2", name: "q2", inital: false, final: false },
        },
        {
          data: { id: "q3", name: "q3", inital: false, final: false },
        },
        {
          data: { id: "q4", name: "q4", inital: false, final: true },
        },
      ],
      edges: [
        { data: { id: "q0q1", source: "q0", target: "q1", label: "aZXZ" } },
        { data: { id: "q1q2", source: "q1", target: "q2", label: "bXε" } },
        { data: { id: "q1q3", source: "q1", target: "q3", label: "cXε" } },
        { data: { id: "q3q4", source: "q3", target: "q4", label: "εZε" } },
      ],
    };
  }
}

export class grammarExamples {
  static get g1() {
    return [
      ["S", "AB"],
      ["A", "aA"],
      ["A", ""],
      ["B", "bB"],
      ["B", ""],
    ];
  }
}
