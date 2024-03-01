import { AstNode } from "./ast-node";
import { Expression } from "./expression"

export type Binary = AstNode<"Binary"> & {
    left: Expression<string>;
    operator: string;
    right: Expression<string>;
}