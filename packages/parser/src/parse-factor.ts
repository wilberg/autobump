import { TokenType } from "@tagup/scanner";
import { Context } from "./types/context";
import { Expression } from "./types/expression";
import { peek } from "./peek";
import { consume } from "./consume";
import { parseUnary } from "./parse-unary";
import { Binary } from "./types/binary";

export function parseFactor(context: Context): Expression<string> {
    let expression = parseUnary(context);

    let type: TokenType | null;
    while (type = peek(context)?.type ?? null,
        type === TokenType.Slash ||
        type === TokenType.Star
    ) {
        const operator = consume(context)!;
        const right = parseUnary(context);
        expression = {
            type: "Binary",
            left: expression,
            operator: operator.value,
            right
        } as Binary;
    }

    return expression;
}