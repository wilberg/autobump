import { Block } from "./block";
import { Expression } from "./expression";
import { Fragment } from "./fragment";

export type IfBlock = Block<"IfBlock"> & {
    test: Expression<string>
    alternate: Fragment|null
}