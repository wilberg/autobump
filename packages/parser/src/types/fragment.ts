import { AstNode } from "./ast-node";

export type Fragment = AstNode<"Fragment"> & {
    content: AstNode<string>[]
}