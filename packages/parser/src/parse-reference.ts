import { TokenType } from "@tagup/scanner";
import { consume } from "./consume";
import { Context } from "./types/context";
import { Identifier } from "./types/identifier";
import { Member } from "./types/member";
import { peek } from "./peek";
import { parseExpression } from "./parse-expression";
import { Expression } from "./types/expression";
import { Call } from "./types/call";

export function parseReference(context: Context): Identifier|Member|Call {
    const token = consume(context, { type: TokenType.Identifier, message: "Identifier expected." })!;

    let expression: Call|Identifier|Member = {
        type: "Identifier",
        name: token.value
    } as Identifier;

    while (peek(context)?.type === TokenType.Dot) {
        consume(context); // Consume the dot.
        const identifier = consume(context, { type: TokenType.Identifier, message: "Expected identifier" })!;
        expression = {
            type: "Member",
            object: expression,
            property: {
                type: "Identifier",
                name: identifier.value
            }
        } as Member
    }

    if (peek(context)?.type === TokenType.ParenthesisLeft) {
        consume(context); // Consume the parenthesis.
        const args: Expression<string>[] = [];
        while (peek(context)?.type !== TokenType.ParenthesisRight && peek(context) !== undefined) {
            
            args.push(parseExpression(context));
            
            if (peek(context)?.type !== TokenType.ParenthesisRight) {
                consume(context, { type: TokenType.Comma, message: "Expected , between function arguments." });
            }
        }

        consume(context, { type: TokenType.ParenthesisRight, message: "Expected ) after function call." });

        expression = {
            type: "Call",
            callee: expression,
            arguments: args
        } as Call;
    }

    return expression;
}