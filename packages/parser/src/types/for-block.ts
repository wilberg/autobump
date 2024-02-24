import { Block } from "./block";
import { Identifier } from "./identifier";

export type ForBlock = Block<"ForBlock"> & {
    variable: Identifier
    iterator: Identifier
}