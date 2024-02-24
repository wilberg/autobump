import { Expression } from "./expression";

export type Literal = Expression<"Literal"> & {
    kind: 'string'|'number'|'null'|'boolean'
    value: string|number|null|boolean
}