import { AstNode } from "./ast-node"

export type Program = AstNode<"Program"> & {
    fragments: AstNode<string>[];
}