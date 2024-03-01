import { TokenType } from "@tagup/scanner";
import { Context } from "./types/context";
import { Expression } from "./types/expression";
import { peek } from "./peek";
import { consume } from "./consume";
import { Binary } from "./types/binary";
import { parseTerm } from "./parse-term";

export function parseComparison(context: Context): Expression<string> {
    let expression = parseTerm(context);

    let type: TokenType | null;
    while (type = peek(context)?.type ?? null,
        type === TokenType.GreaterThan ||
        type === TokenType.LessThan
    ) {
        const operator = consume(context)!;
        const right = parseTerm(context);
        expression = {
            type: "Binary",
            left: expression,
            operator: operator.value,
            right
        } as Binary;
    }

    return expression;

}