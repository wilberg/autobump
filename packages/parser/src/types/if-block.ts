import { AstNode } from "./ast-node";
import { Block } from "./block";
import { Expression } from "./expression";

export type IfBlock = Block<"IfBlock"> & {
    test: Expression<string>
    alternate: AstNode<string>[]|null
}