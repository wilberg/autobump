import { Token, TokenType } from "@tagup/scanner";
import { Context } from "./types/context";

export function consume(context: Context, condition?: {
    type: TokenType
    message: string
    value?: string
}): Token | null {
    const token: Token | null = context.tokens[context.index++] ?? null;
    
    if (condition) {
        if (token?.type !== condition.type && (!condition.value || token.value === condition.value)) {
            context.errors.push({
                message: `[${token.type}]: ${condition.message}`
            })
        }
    }

    return token;
}