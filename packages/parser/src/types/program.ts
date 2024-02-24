import { AstNode } from "./ast-node"
import { Fragment } from "./fragment";

export type Program = AstNode<"Program"> & {
    fragment: Fragment;
}