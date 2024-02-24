import { Expression } from "./expression";
import { Identifier } from "./identifier";

export type Member = Expression<"Member"> & {
    object: Member|Identifier,
    property: Identifier
}