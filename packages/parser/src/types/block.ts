import { AstNode } from "./ast-node";
import { Fragment } from "./fragment";

export type Block<T extends string> = AstNode<T> & {
    fragment: Fragment
}