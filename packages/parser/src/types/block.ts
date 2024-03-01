import { AstNode } from "./ast-node";

export type Block<T extends string> = AstNode<T> & {
    fragments: AstNode<string>[]
}