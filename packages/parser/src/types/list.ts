import { Expression } from "./expression";

export type List = Expression<"List"> & {
    items: Expression<string>[];
};