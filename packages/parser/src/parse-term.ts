import { TokenType } from "@tagup/scanner";
import { peek } from "./peek";
import { Context } from "./types/context";
import { Expression } from "./types/expression";
import { consume } from "./consume";
import { Binary } from "./types/binary";
import { parseFactor } from "./parse-factor";

export function parseTerm(context: Context): Expression<string> {
    let expression = parseFactor(context);

    let type: TokenType | null;
    while (type = peek(context)?.type ?? null,
        type === TokenType.Plus ||
        type === TokenType.Minus
    ) {
        const operator = consume(context)!;
        const right = parseFactor(context);
        expression = {
            type: "Binary",
            left: expression,
            operator: operator.value,
            right
        } as Binary;
    }

    return expression;
}