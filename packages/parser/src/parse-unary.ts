import { TokenType } from "@tagup/scanner";
import { peek } from "./peek";
import { Context } from "./types/context";
import { Expression } from "./types/expression";
import { Unary } from "./types/unary";
import { consume } from "./consume";
import { parsePrimary } from "./parse-primary";

export function parseUnary(context: Context): Expression<string> {
    let type = peek(context)?.type ?? null;
    if (type === TokenType.Minus || type === TokenType.Bang) {
        const operator = consume(context)!;
        const right = parseUnary(context);
        return {
            type: "Unary",
            operator: operator.value,
            right
        } as Unary;
    }
    return parsePrimary(context)!;
}