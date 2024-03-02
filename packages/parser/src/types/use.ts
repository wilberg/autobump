import { Expression } from "./expression";

export type Use = Expression<"Use"> & {
    path: string;
}