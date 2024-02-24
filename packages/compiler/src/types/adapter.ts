import { type Program } from "@tagup/parser";

export type Adapter<T = string> = (program: Program) => T