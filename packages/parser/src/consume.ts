import { Token, TokenType } from "@tagup/scanner";
import { Context } from "./types/context";

export function consume(context: Context, condition?: {
    type: TokenType
    message: string
    value?: string
}): Token {
    const token = context.tokens[context.index++];
    
    if (condition) {
        if (token.type !== condition.type && (!condition.value || token.value === condition.value)) {
            context.errors.push({
                message: `[${token.type}]: ${condition.message}`
            })
        }
    }

    return token;
}