import { TokenType } from "@tagup/scanner";
import { Context } from "./types/context";
import { Expression } from "./types/expression";
import { Literal } from "./types/literal";
import { consume } from "./consume";
import { parseReference } from "./parse-reference";
import { parseExpression } from "./parse-expression";
import { Grouping } from "./types/grouping";
import { peek } from "./peek";
import { List } from "./types/list";

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
        case TokenType.BracketLeft:
            consume(context); // Consumes the [
            const items = [];
            while (peek(context)?.type !== TokenType.BracketRight) {
                items.push(parseExpression(context)); // Parse the expression
                if (peek(context)?.type === TokenType.Comma) {
                    consume(context); // Consumes the ,
                }
            }
            consume(context, { type: TokenType.BracketRight, message: "Expected ] after list"}); // Consumes the ]
            return {
                type: "List",
                items
            } as List;
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