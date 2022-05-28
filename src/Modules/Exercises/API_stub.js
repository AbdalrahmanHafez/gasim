import tabTypes from "../../enums/tabTypes";
import { machineExamples } from "../../Helpers/Constatns";
import { addLabelDataForExampleElements } from "../../utils";

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
        type: "choice",
        title: "1 + 2 = 3 is that true?",
        options: ["True", "False"],
        answer: "True",
      },

      {
        type: "choice",
        title: "Choose the Correct option. (Hint): ends with a vowel",
        options: ["Abcd", "Klmn", "ghi", "weqewqc", "ewqel"],
        answer: "ghi",
      },

      {
        type: "choice",
        title: "Select the number which is divisable by 2",
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
        value:
          "Enter a string that is accepted by the following Regular Expression",
      },
      {
        type: "stringAcceptance",
        question: {
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
        question: { type: "PDA", elements: elmPDA },
      },

      {
        type: "text",
        value: "Enter a string that is accepted by the following NFA",
      },
      {
        type: "stringAcceptance",
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
      },

      {
        type: "text",
        value: "Enter a string that is accepted by the following DFA",
      },
      {
        type: "stringAcceptance",
        question: {
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
        question: { type: "RE", string: "ab*c" },
      },
    ],
  },
];

export { ExercisesStub };
