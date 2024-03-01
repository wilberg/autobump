import { AstNode } from "./ast-node";
import { Expression } from "./expression";

export type Grouping = AstNode<"Grouping"> & {
    expression: Expression<string>;
}