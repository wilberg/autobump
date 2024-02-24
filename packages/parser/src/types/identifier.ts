import { Expression } from "./expression";

export type Identifier = Expression<"Identifier"> & {
    name: string;
}