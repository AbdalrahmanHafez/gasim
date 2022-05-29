import tabTypes from "../../../enums/tabTypes";
import { machineExamples } from "../../../Helpers/Constatns";
import { addLabelDataForExampleElements } from "../../../utils";

let elmPDA = machineExamples.elmPDA;
addLabelDataForExampleElements(elmPDA, tabTypes.PDA);

// Types: ['text', 'choice', 'equivalence','stringAcceptance']

const ExercisesStub = [
  {
    id: 0,
    title: "Exercise 1",
    description: "This is a description of the exercise",
    content: [
      {
        type: "text",
        value: "1 + 2 = 3 is this true?",
      },
      {
        type: "choice",
        options: ["True", "False"],
        answer: "True",
      },

      {
        type: "text",
        value: "Choose the Correct option. (Hint): ends with a vowel",
      },

      {
        type: "choice",
        options: ["Abcd", "Klmn", "ghi", "weqewqc", "ewqel"],
        answer: "ghi",
      },

      {
        type: "text",
        value: "Select the number which is divisable by 2",
      },

      {
        type: "choice",
        options: ["123", "532", "21315"],
        answer: "532",
      },

      {
        type: "text",
        value: "Please Convert the following NFA into it's equivalent DFA",
      },
      {
        type: "equivalence",
        question: {
          type: "NFA",
          elements: {
            nodes: [
              {
                data: { id: "a", name: "a", inital: true, final: false },
              },
              {
                data: { id: "b", name: "b", inital: false, final: false },
              },
              {
                data: { id: "s", name: "s", inital: false, final: false },
              },
              { data: { id: "f", name: "f", inital: false, final: true } },
            ],
            edges: [
              { data: { id: "ab", source: "a", target: "b", label: "a" } },
              { data: { id: "bf", source: "b", target: "f", label: "b" } },
              { data: { id: "as", source: "a", target: "s", label: "ε" } },
              { data: { id: "sb", source: "s", target: "b", label: "ε" } },
            ],
          },
        },
        answer: {
          type: "DFA",
          elements: {
            nodes: [
              {
                data: { id: "a", name: "a", inital: true, final: false },
              },
              {
                data: { id: "b", name: "b", inital: false, final: false },
              },
              { data: { id: "f", name: "f", inital: false, final: true } },
            ],
            edges: [
              { data: { id: "ab", source: "a", target: "b", label: "a" } },
              { data: { id: "af", source: "a", target: "f", label: "b" } },
              { data: { id: "bf", source: "b", target: "f", label: "b" } },
            ],
          },
        },
      },

      {
        type: "text",
        value:
          "Please Convert the following Regular Expression into it's equivalent NFA",
      },
      {
        type: "equivalence",
        question: { type: "RE", string: "ab*c" },
        answer: {
          type: "NFA",
          elements: {
            nodes: [
              { data: { id: "a", name: "a", inital: true, final: false } },
              { data: { id: "b", name: "b", inital: false, final: false } },
              { data: { id: "c", name: "c", inital: false, final: true } },
            ],
            edges: [
              { data: { id: "ab", source: "a", target: "b", label: "a" } },
              { data: { id: "bb", source: "b", target: "b", label: "b" } },
              { data: { id: "bc", source: "b", target: "c", label: "c" } },
            ],
          },
        },
      },

      {
        type: "text",
        value: "Please Convert the following NFA to it's equivalent RE",
      },
      {
        type: "equivalence",
        question: {
          type: "NFA",
          elements: {
            nodes: [
              { data: { id: "a", name: "a", inital: true, final: false } },
              { data: { id: "b", name: "b", inital: false, final: false } },
              { data: { id: "c", name: "c", inital: false, final: true } },
            ],
            edges: [
              { data: { id: "ab", source: "a", target: "b", label: "a" } },
              { data: { id: "bb", source: "b", target: "b", label: "b" } },
              { data: { id: "bc", source: "b", target: "c", label: "c" } },
            ],
          },
        },
        answer: { type: "RE", string: "ab*c" },
      },

      {
        type: "text",
        value: "Enter a string that is accepted by the following Grammar",
      },
      {
        type: "stringAcceptance",
        machine: {
          type: "GR",
          productions: [
            ["S", "AB"],
            ["A", "aA"],
            ["A", ""],
            ["B", "bB"],
            ["B", ""],
          ],
        },
      },

      {
        type: "text",
        value:
          "Enter a string that is accepted by the following Push Down Automaton",
      },
      {
        type: "stringAcceptance",
        machine: { type: "PDA", elements: elmPDA },
      },

      {
        type: "text",
        value: "Enter a string that is accepted by the following NFA",
      },
      {
        type: "stringAcceptance",
        machine: {
          type: "NFA",
          elements: {
            nodes: [
              { data: { id: "a", name: "a", inital: true, final: false } },
              { data: { id: "b", name: "b", inital: false, final: false } },
              { data: { id: "c", name: "c", inital: false, final: true } },
            ],
            edges: [
              { data: { id: "ab", source: "a", target: "b", label: "a" } },
              { data: { id: "bb", source: "b", target: "b", label: "b" } },
              { data: { id: "bc", source: "b", target: "c", label: "c" } },
            ],
          },
        },
      },

      {
        type: "text",
        value: "Enter a string that is accepted by the following DFA",
      },
      {
        type: "stringAcceptance",
        machine: {
          type: "DFA",
          elements: {
            nodes: [
              { data: { id: "a", name: "a", inital: true, final: false } },
              { data: { id: "b", name: "b", inital: false, final: false } },
              { data: { id: "c", name: "c", inital: false, final: true } },
            ],
            edges: [
              { data: { id: "ab", source: "a", target: "b", label: "a" } },
              { data: { id: "bc", source: "b", target: "c", label: "b" } },
            ],
          },
        },
      },

      {
        type: "text",
        value: "Enter a string that is accepted by the following RE",
      },
      {
        type: "stringAcceptance",
        machine: { type: "RE", string: "ab*c" },
      },
    ],
  },
];

export { ExercisesStub };
