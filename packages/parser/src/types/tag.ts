import { AstNode } from "./ast-node";
import { Expression } from "./expression";

export type Tag = AstNode<"Tag"> & {
    expression: Expression<string>
}