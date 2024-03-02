import { Expression } from "./expression";

export type Call = Expression<"Call"> & {
    callee: Expression<string>;
    arguments: Expression<string>[];
}