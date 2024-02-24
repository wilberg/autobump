import { AstNode } from "./ast-node";

export type Constant = AstNode<"Constant"> & {
    value: string;
}