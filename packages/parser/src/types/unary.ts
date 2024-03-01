import { AstNode } from "./ast-node";
import { Expression } from "./expression"

export type Unary = AstNode<"Unary"> & {
    operator: string;
    right: Expression<string>;
}