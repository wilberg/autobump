import { TokenType } from "@tagup/scanner";
import { peek } from "./peek";
import { Binary } from "./types/binary";
import { Context } from "./types/context";
import { Expression } from "./types/expression";
import { consume } from "./consume";
import { parseComparison } from "./parse-comparison";

export function parseEquality(context: Context): Expression<string> {
    let expression = parseComparison(context);

    let type: TokenType | null;
    while (type = peek(context)?.type ?? null, type === TokenType.Equal || type === TokenType.NotEqual) {
        const operator = consume(context)!;
        const right = parseComparison(context);
        expression = {
            type: "Binary",
            left: expression,
            operator: operator.value,
            right
        } as Binary;
    }

    return expression;
}