import {
  createHeadlessCy,
  verifyAtLeastFinalState,
  verifyInitalStateExists,
  getFinalNodes,
  getInitalNode,
} from "../../utils";

import axios from "axios";
import { symbols, baseurl } from "../../Helpers/Constatns";

export default class FSAtoRE {
  constructor(FSAModel) {
    this.FSAModel = FSAModel;
    this.cy = null; // filled during convert()

    this.result = null;
  }

  get exportResult() {
    return this.result;
  }

  alertVerify() {
    const cy = createHeadlessCy(this.FSAModel.elements);
    // ther's atlest one final state
    // there's atleast one inital state
    if (!verifyInitalStateExists(cy) || !verifyAtLeastFinalState(cy))
      return false;
    return true;
  }

  #isConvertable(cy) {
    const finalNodes = getFinalNodes(cy);

    if (finalNodes.length !== 1) {
      return false;
    }

    const initialState = getInitalNode(cy);
    if (finalNodes[0] === initialState) {
      return false;
    }

    return true;
  }

  #getSingleFinalState(cy) {
    const finalNodes = getFinalNodes(cy);
    const newFinalNode = cy.add({
      group: "nodes",
      data: {
        id: "FSAtoRE_final",
        name: "final",
        inital: false,
        final: true,
      },
    });

    finalNodes.forEach((fnode) => {
      fnode.data("final", false);
      cy.add({
        group: "edges",
        data: {
          id: `${fnode.data("id")}_${newFinalNode.data("id")}`,
          source: fnode.data("id"),
          target: newFinalNode.data("id"),
          label: symbols.lamda,
        },
      });
    });
  }

  #or(r1, r2) {
    if (r1 === symbols.empty) return r2;
    if (r2 === symbols.empty) return r1;
    if (r1 === "" && r2 === "") return "";
    if (r1 === "") r1 = symbols.lamda;
    if (r2 === "") r2 = symbols.lamda;
    // if(needsParens(r1)) r1 = addParen(r1);
    // if(needsParens(r2)) r2 = addParen(r2);
    return r1 + "+" + r2;
  }

  #star(r1) {
    if (r1 === symbols.empty || r1 === "") return "";

    if (
      this.#discretizerOr(r1).length > 1 ||
      this.#discretizerCat(r1).length > 1
    ) {
      // r1 = addParen(r1);
      r1 = "(" + r1 + ")";
    } else {
      // if (r1.endsWith(KLEENE_STAR)) return r1;
      if (r1.endsWith("*")) return r1;
    }
    return r1 + "*";
  }

  #concatenate(r1, r2) {
    if (r1 === symbols.empty || r2 === symbols.empty) return symbols.empty;
    else if (r1 === "") return r2;
    else if (r2 === "") return r1;
    if (this.#discretizerOr(r1).length > 1) r1 = "(" + r1 + ")";
    if (this.#discretizerOr(r2).length > 1) r2 = "(" + r2 + ")";
    return r1 + r2;
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

  #convertToSimpleAutomaton() {
    const cy = this.cy;
    if (!this.#isConvertable(cy)) this.#getSingleFinalState(cy);

    const nodes = cy.$("node");

    for (let k = 0; k < nodes.length; k++) {
      for (let j = 0; j < nodes.length; j++) {
        const edges = nodes[k].edgesTo(nodes[j]);

        const length = edges.length;
        if (length === 0) {
          cy.add({
            group: "edges",
            data: {
              id: `${nodes[k].data("id")}_${nodes[j].data("id")}`,
              source: nodes[k].data("id"),
              target: nodes[j].data("id"),
              label: symbols.empty,
            },
          });
        }

        if (length === 1) {
          let label = edges[0].data("label").replace(symbols.epsilon, "");
          edges[0].remove();

          for (let i = 1; i < edges.length; i++) {
            label = this.#or(label, edges[i].data("label"));
            edges[i].remove();
          }

          cy.add({
            group: "edges",
            data: {
              id: `${nodes[k].data("id")}_${nodes[j].data("id")}`,
              source: nodes[k].data("id"),
              target: nodes[j].data("id"),
              label: label,
            },
          });
        }
      }
    }
  }

  #getExpression(p, q, k) {
    const fromState = p;
    const toState = q;
    const removeState = k;

    const pq = fromState.edgesTo(toState).data("label");

    const pk = fromState.edgesTo(removeState).data("label");

    const kk = removeState.edgesTo(removeState).data("label");

    const kq = removeState.edgesTo(toState).data("label");

    const temp1 = this.#star(kk);
    const temp2 = this.#concatenate(pk, temp1);
    const temp3 = this.#concatenate(temp2, kq);
    const label = this.#or(pq, temp3);

    // console.log(
    //   `label is '${label}', between ${fromState.data("id")} to ${toState.data(
    //     "id"
    //   )}\nvalues are: ${pq}, ${pk}, ${kk}, ${kq}\ntemp is: ${temp1}, ${temp2}, ${temp3}`
    // );

    return label;
  }

  #getTransitionsForRemoveState(node) {
    const cy = this.cy;
    const finalNode = getFinalNodes(cy)[0];
    const initalNode = getInitalNode(cy);
    // isRemovable()
    if (node === finalNode || node === initalNode) return null;

    const list = [];
    const k = node;

    const nodes = cy.$("node");

    for (let i = 0; i < nodes.length; i++) {
      let p = nodes[i];
      if (p !== k) {
        for (let j = 0; j < nodes.length; j++) {
          let q = nodes[j];
          if (q !== k) {
            const exp = this.#getExpression(p, q, k);

            list.push({
              group: "edges",
              data: {
                id: `${p.data("id")}_${q.data("id")}`,
                source: p.data("id"),
                target: q.data("id"),
                label: exp,
              },
            });
          }
        }
      }
    }

    return list;
  }

  #removeState(node, transitions) {
    const cy = this.cy;

    cy.edges().remove();

    node.remove();

    transitions.forEach((transition) => {
      cy.add(transition);
    });
  }

  #convertToGTG() {
    const cy = this.cy;
    const finalNode = getFinalNodes(cy)[0];
    const initalNode = getInitalNode(cy);

    const nodes = cy.$("node");

    for (let k = 0; k < nodes.length; k++) {
      const node = nodes[k];

      if (node !== finalNode && node !== initalNode) {
        const transitions = this.#getTransitionsForRemoveState(node);

        // console.log(
        //   `transitions after removing ${node.data("id")} are`,
        //   transitions
        // );

        this.#removeState(node, transitions);

        // throw new Error("stopped here");
      }
    }
  }

  #getExpressionFromGTG() {
    const cy = this.cy;
    const finalNode = getFinalNodes(cy)[0];
    const initalNode = getInitalNode(cy);

    const ii = initalNode.edgesTo(initalNode).data("label");
    const ij = initalNode.edgesTo(finalNode).data("label");
    const ji = finalNode.edgesTo(initalNode).data("label");
    const jj = finalNode.edgesTo(finalNode).data("label");

    const temp = this.#concatenate(
      this.#star(ii),
      this.#concatenate(ij, this.#concatenate(this.#star(jj), ji))
    );

    const temp2 = this.#concatenate(
      this.#star(ii),
      this.#concatenate(ij, this.#star(jj))
    );

    const expression = this.#concatenate(this.#star(temp), temp2);

    return expression;
  }

  convert(cy) {
    console.log("Clicked converting button, FSA to RE");
    this.alertVerify();

    // const cy = createHeadlessCy(this.FSAModel.elements);

    this.cy = cy;

    this.#convertToSimpleAutomaton();

    this.#convertToGTG();

    const result = this.#getExpressionFromGTG();
    this.result = result;

    return result;
  }
}
