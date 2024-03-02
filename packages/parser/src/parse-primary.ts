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
import { Use } from "./types/use";

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
        case TokenType.Reserved:
            if (token.value === "true" || token.value === "false") {
                consume(context);
                return {
                    type: "Literal",
                    kind: "boolean",
                    value: token.value === "true"
                } as Literal;
            } else if (token.value === "null") {
                consume(context);
                return {
                    type: "Literal",
                    kind: "null",
                    value: null
                } as Literal;
            } else if (token.value === "use") {
                consume(context);
                const path = consume(context, { type: TokenType.String, message: "Expected string after use" });

                return {
                    type: "Use",
                    path: path?.value
                } as Use;
            }
            break;
        case TokenType.ParenthesisLeft:
            consume(context);
            const expression = parseExpression(context);
            consume(context, { type: TokenType.ParenthesisRight, message: "Expected ) after expression"})
            return {
                type: "Grouping",
                expression
            } as Grouping;
        default: break;
    }

    return null;
}