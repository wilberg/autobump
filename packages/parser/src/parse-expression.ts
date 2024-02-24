import { TokenType } from "@tagup/scanner";
import { consume } from "./consume";
import { Context } from "./types/context";
import { Expression } from "./types/expression";
import { Literal } from "./types/literal";
import { parseReference } from "./parse-reference";
import { peek } from "./peek";

export function parseExpression(context: Context): Expression<string> {
    const token = peek(context);
    let expression: Expression<string> = {
        type: "UnknownExpression",
        from: token.range[0],
        to: token.range[1]
    };
    
    switch (token.type) {
        case TokenType.Identifier:
            expression = parseReference(context);
            break;
        case TokenType.String:
            consume(context);
            expression = {
                type: "Literal",
                kind: "string",
                value: token.value
            } as Literal
            break;
        case TokenType.Number:
            consume(context);
            expression = {
                type: "Literal",
                kind: "number",
                value: +token.value
            } as Literal
            break;
    }


    return expression;
}