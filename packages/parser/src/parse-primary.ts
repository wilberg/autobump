import { TokenType } from "@tagup/scanner";
import { Context } from "./types/context";
import { Expression } from "./types/expression";
import { Literal } from "./types/literal";
import { consume } from "./consume";
import { parseReference } from "./parse-reference";
import { parseExpression } from "./parse-expression";
import { Grouping } from "./types/grouping";
import { peek } from "./peek";

export function parsePrimary(context: Context): Expression<string>|null {
    const token = peek(context)!;

    switch (token.type) {
        case TokenType.Number:
            consume(context);
            return {
                type: "Literal",
                kind: "number",
                value: +token.value
            } as Literal;
        case TokenType.String:
            consume(context);
            return {
                type: "Literal",
                kind: "string",
                value: token.value
            } as Literal;
        case TokenType.Identifier:
            return parseReference(context);
        default:
            break;
    }

    if (token.type === TokenType.ParenthesisLeft) {
        consume(context);
        const expression = parseExpression(context);
        consume(context, { type: TokenType.ParenthesisRight, message: "Expected ) after expression"})
        return {
            type: "Grouping",
            expression
        } as Grouping
    }

    return null;
}