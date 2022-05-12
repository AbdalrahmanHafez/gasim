import {
  createHeadlessCy,
  verifyAtLeastFinalState,
  verifyInitalStateExists,
} from "../../utils";
import axios from "axios";
import { baseurl } from "../../Helpers/Constatns";
import { REModel } from "../RE";
import { symbols } from "../../Helpers/Constatns";

export default class REtoNFA {
  constructor(REModel) {
    this.REModel = REModel;
    this.cy = null;
    this.todo = new Set(); //edges

    this.DEPARENS = 1;
    this.DESTAR = 2;
    this.DEOR = 3;
    this.DECAT = 4;

    this.action = 0;
    this.transition = null; //edge
    this.replacements = []; //edges
    this.transitionNeeded = 0;
  }

  get exportResult() {
    return this.cy.json().elements;
  }

  #delambda(string) {
    return string === symbols.lamda ? "" : string;
  }

  #discretizerCat(expression) {
    const se = [];
    let start = 0;
    let level = 0;
    for (let i = 0; i < expression.length; i++) {
      let c = expression.charAt(i);
      if (c === ")") {
        level--;
        continue;
      }
      if (c === "(") level++;
      if (!(c === "(" && level === 1) && level !== 0) continue;
      if (c === "+") {
        // Hum. That shouldn't be...
        throw new Error("+ encountered in cat discretization!");
      }
      if (c === "*") continue;
      // Not an operator, and on the first level!
      if (i === 0) continue;
      se.push(this.#delambda(expression.substring(start, i)));
      start = i;
    }
    se.push(this.#delambda(expression.substring(start)));

    return se;
  }

  #discretizerOr(expression) {
    const se = [];
    let start = 0;
    let level = 0;
    for (let i = 0; i < expression.length; i++) {
      if (expression.charAt(i) === "(") level++;
      if (expression.charAt(i) === ")") level--;
      if (expression.charAt(i) !== "+") continue;
      if (level !== 0) continue;
      // First level or!
      se.push(this.#delambda(expression.substring(start, i)));
      start = i + 1;
    }

    se.push(this.#delambda(expression.substring(start)));

    return se;
  }

  #requiredAction(expression) {
    if (expression.length <= 1) return 0;
    if (this.#discretizerOr(expression).length > 1) return this.DEOR;
    if (this.#discretizerCat(expression).length > 1) return this.DECAT;
    if (expression.charAt(expression.length - 1) === "*") return this.DESTAR;
    if (
      expression.charAt(0) === "(" &&
      expression.charAt(expression.length - 1) === ")"
    )
      return this.DEPARENS;
    throw new Error("Expression " + expression + " not recognized!");
  }

  #lambda(fromNode, toNode) {
    return this.cy.add({
      group: "edges",
      data: {
        id: `lambda_${fromNode.data("id")}_${toNode.data("id")}${
          this.cy.edges().length
        }`,
        source: fromNode.data("id"),
        target: toNode.data("id"),
        label: symbols.epsilon,
        // label: "",
      },
    });
  }

  #replaceTransition(transition, exps) {
    // Compose the transform.
    // AffineTransform at = new AffineTransform();
    // Point pStart = transition.getFromState().getPoint();
    // Point pEnd = transition.getToState().getPoint();
    // at.translate(pStart.x, pStart.y);
    // at.scale(pStart.distance(pEnd), pStart.distance(pEnd));
    // at.rotate(Math.atan2(pEnd.y - pStart.y, pEnd.x - pStart.x));

    // FSATransition[] t = new FSATransition[exps.length];
    // Point2D.Double ps = new Point2D.Double(0.2, 0.0);
    // Point2D.Double pe = new Point2D.Double(0.8, 0.0);

    // automaton.removeTransition(transition);
    transition.remove();

    const createEdges = [];

    // console.log("exps", exps);

    for (let i = 0; i < exps.length; i++) {
      // pStart = new Point();
      // pEnd = new Point();
      // double y = exps.length > 1 ? ((double) i
      // 		/ ((double) exps.length - 1.0) - 0.5) * 0.5 : 0.0;
      // pe.y = ps.y = y;
      // at.transform(ps, pStart);
      // at.transform(pe, pEnd);
      // // Clamp bounds.
      // pStart.x = Math.max(pStart.x, 20);
      // pStart.y = Math.max(pStart.y, 20);
      // pEnd.x = Math.max(pEnd.x, 20);
      // pEnd.y = Math.max(pEnd.y, 20);

      // State s = automaton.createState(pStart);
      // State e = automaton.createState(pEnd);
      // t[i] = new FSATransition(s, e, exps[i]);
      // automaton.addTransition(t[i]);

      const pStartId = "pStart_" + this.cy.nodes().length;
      this.cy.add({
        group: "nodes",
        data: {
          id: pStartId,
          name: `q${this.cy.nodes().length}`,
          inital: false,
          final: false,
        },
      });

      const pEndId = "pEnd_" + this.cy.nodes().length;
      this.cy.add({
        group: "nodes",
        data: {
          id: pEndId,
          name: `q${this.cy.nodes().length}`,
          inital: false,
          final: false,
        },
      });

      const addedEdge = this.cy.add({
        group: "edges",
        data: {
          id: `replaceTransition_${pStartId}_${pEndId}`,
          source: pStartId,
          target: pEndId,
          label: exps[i],
        },
      });

      createEdges.push(addedEdge);

      if (this.#requiredAction(addedEdge.data("label")) !== 0)
        this.todo.add(addedEdge);
    }

    return createEdges;
  }

  #transitionCheck(transition) {
    // if (action != 0) {
    // 	JOptionPane.showMessageDialog(convertPane,
    // 			"We're already in the process of\n"
    // 					+ "deexpressionifying a transition.",
    // 			"Already Active", JOptionPane.ERROR_MESSAGE);
    // 	return;
    // }
    // if ((action = requiredAction(transition.getLabel())) == 0) {
    // 	JOptionPane.showMessageDialog(convertPane,
    // 			"That's as good as it gets.", "No Action Necessary",
    // 			JOptionPane.ERROR_MESSAGE);
    // 	return;
    // }

    if (this.action !== 0) {
      return;
    }

    this.action = this.#requiredAction(transition.data("label"));
    if (this.action === 0) {
      return;
    }

    this.transition = transition;
    this.todo.delete(transition);
    const label = transition.data("label");
    // console.log("action is", this.action);
    // console.log("transitionCheck action is ", this.action);

    switch (this.action) {
      case this.DEPARENS: {
        const s1 = transition.source();
        const s2 = transition.target();

        const newLabel = this.#delambda(label.substring(1, label.length - 1));
        // automaton.removeTransition(transition);
        transition.remove();

        // FSATransition t = new FSATransition(s1, s2, newLabel);
        // automaton.addTransition(t);
        const addedEdge = this.cy.add({
          group: "edges",
          data: {
            id: `${s1.data("id")}_${s2.data("id")}`,
            source: s1.data("id"),
            target: s2.data("id"),
            label: newLabel,
          },
        });

        if (this.#requiredAction(newLabel) !== 0) this.todo.add(addedEdge);
        this.action = 0; // That's all that need be done.
        break;
      }
      case this.DESTAR:
        // replacements = replaceTransition(transition, new String[] { Discretizer.delambda(label.substring(0, label.length() - 1)) });
        this.replacements = this.#replaceTransition(transition, [
          this.#delambda(label.substring(0, label.length - 1)),
        ]);

        this.transitionNeeded = 4;
        break;
      case this.DEOR:
        this.replacements = this.#replaceTransition(
          transition,
          this.#discretizerOr(label)
        );
        this.transitionNeeded = 2 * this.replacements.length;
        break;
      case this.DECAT:
        this.replacements = this.#replaceTransition(
          transition,
          this.#discretizerCat(label)
        );

        this.transitionNeeded = this.replacements.length + 1;

        break;
      default:
    }

    this.#nextStep();
  }

  #completeStep() {
    // console.log("in completestep action is ", this.action);
    if (this.action === 0) {
      const it = this.todo.values();
      const edge = it.next().value;
      this.#transitionCheck(edge);
    }

    const fromNode = this.transition.source();
    const toNode = this.transition.target();

    switch (this.action) {
      case this.DEPARENS:
        // Probably a deparenthesization, or whatever.
        return;
      case this.DEOR:
        for (let i = 0; i < this.replacements.length; i++) {
          // automaton.addTransition(lambda(from, replacements[i].getFromState()));
          this.#lambda(fromNode, this.replacements[i].source());

          // automaton.addTransition(lambda(replacements[i].getToState(), to));
          this.#lambda(this.replacements[i].target(), toNode);
        }
        break;
      case this.DECAT:
        // automaton.addTransition(lambda(from, replacements[0].getFromState()));
        this.#lambda(fromNode, this.replacements[0].source());

        for (let i = 0; i < this.replacements.length - 1; i++)
          // automaton.addTransition(
          //   lambda(
          //     replacements[i].getToState(),
          //     replacements[i + 1].getFromState()
          //   )
          // );

          this.#lambda(
            this.replacements[i].target(),
            this.replacements[i + 1].source()
          );

        // automaton.addTransition(
        //   lambda(replacements[replacements.length - 1].getToState(), to)
        // );
        this.#lambda(
          this.replacements[this.replacements.length - 1].target(),
          toNode
        );

        break;
      case this.DESTAR:
        // automaton.addTransition(lambda(from, replacements[0].getFromState()));
        // automaton.addTransition(lambda(replacements[0].getToState(), to));
        // automaton.addTransition(lambda(from, to));
        // automaton.addTransition(lambda(to, from));
        this.#lambda(fromNode, this.replacements[0].source());
        this.#lambda(this.replacements[0].target(), toNode);
        this.#lambda(fromNode, toNode);
        this.#lambda(toNode, fromNode);
        break;
      default:
    }

    this.transitionNeeded = 0;
    this.#nextStep();
  }

  #nextStep() {
    if (this.transitionNeeded === 0) {
      if (this.todo.size > 0) {
        // if (this.action !== 0)
        // convertPane.mainLabel.setText("Resolution complete.");
        // else
        // convertPane.mainLabel.setText("Welcome to the converter.");
        // convertPane.detailLabel.setText(toDo.size() + " more resolutions needed.");
        this.action = 0;
        return;
      }
      this.action = 0;
      // We're all done.
      // convertPane.mainLabel.setText("The automaton is complete.");
      // convertPane.detailLabel .setText("\"Export\" will put it in a new window.");
      // convertPane.exportAction.setEnabled(true);
      // convertPane.doStepAction.setEnabled(false);
      // convertPane.doAllAction.setEnabled(false);
      return;
    }

    // convertPane.detailLabel.setText(transitionNeeded + " more " + Universe.curProfile.getEmptyString() + "-transitions needed.");

    // switch (this.action) {
    //   case DEOR:
    //     convertPane.mainLabel.setText("De-oring " + transition.getLabel());
    //     break;
    //   case DECAT:
    //     convertPane.mainLabel.setText(
    //       "De-concatenating " + transition.getLabel()
    //     );
    //     break;
    //   case DESTAR:
    //     convertPane.mainLabel.setText("De-staring " + transition.getLabel());
    //     break;
    //  default:
    // }
  }

  convert(cy) {
    console.log("Convert started");
    const input = this.REModel.inputRegex;
    this.cy = cy;

    // automata setup
    cy.add({
      group: "nodes",
      data: {
        id: "REtoNFA_intial",
        name: "Inital",
        inital: true,
        final: false,
      },
    });

    cy.add({
      group: "nodes",
      data: {
        id: "REtoNFA_final",
        name: "Final",
        inital: false,
        final: true,
      },
    });

    cy.add({
      group: "edges",
      data: {
        id: "REtoNFA_initial_to_final",
        source: "REtoNFA_intial",
        target: "REtoNFA_final",
        label: input,
      },
    });

    // Constructor
    const edge = cy.edges()[0];
    const label = edge.data("label");
    if (this.#requiredAction(label) !== 0) {
      this.todo.add(edge);
    }
    this.#nextStep();
    // End of constructor

    while (this.action !== 0 || this.todo.size > 0) {
      // console.log("loop action", this.action);
      // console.log("todo values");
      // for (let value of this.todo.values()) {
      // console.log(value);
      // }

      this.#completeStep();
    }

    // Debug
    // window.step = () => this.#completeStep();
  }
}
