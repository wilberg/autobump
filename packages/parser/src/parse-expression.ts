import { Context } from "./types/context";
import { Expression } from "./types/expression";
import { parseEquality } from "./parse-equality";

export function parseExpression(context: Context): Expression<string> {
    return parseEquality(context);
}