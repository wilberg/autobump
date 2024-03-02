import { TokenType } from "@tagup/scanner";
import { consume } from "./consume";
import { parseFragments } from "./parse-fragments";
import { Block } from "./types/block";
import { Context } from "./types/context";
import { ForBlock } from "./types/for-block";
import { parseExpression } from "./parse-expression";
import { IfBlock } from "./types/if-block";
import { AstNode } from "./types/ast-node";

export function parseBlock(context: Context): Block<string> {
    const opener = consume(context)!;
    
    switch (opener.value) {
        case "for":
            const variable = consume(context, { type: TokenType.Identifier, message: "Exected identifier" })!;
            consume(context, { type: TokenType.Reserved, value: "as", message: "Expected reserved keyword 'as' following variable"});
            const iterator = parseExpression(context);

            const forFragments = parseFragments(context, (token) => token.type !== TokenType.BlockClose || token.value !== 'for');
            
            return {
                type: "ForBlock",
                iterator,
                variable: {
                    type: "Identifier",
                    name: variable.value
                },
                fragments: forFragments
            } as ForBlock
        case "if":
            const expression = parseExpression(context);

            let hasAlternate = false;
            const ifFragments = parseFragments(context, (token) => {
                if (token.type === TokenType.BlockAlternate) {
                    hasAlternate = true;
                    return false;
                }
                return token.type !== TokenType.BlockClose || token.value !== 'if'
            }, 'Unclosed if statement');

            consume(context, {
                type: TokenType.DelimiterRight,
                message: "Expected right delimiter"
            });

            let alternate: AstNode<string>[]|null = null;
            if (hasAlternate) {
                // Also collect the alternate
                alternate = parseFragments(context, (token) => {
                    return token.type !== TokenType.BlockClose || token.value !== 'if'
                }, "If statement never closed");
            }

            return {
                type: "IfBlock",
                test: expression,
                fragments: ifFragments,
                alternate: alternate
            } as IfBlock
        default:
            context.errors.push({
                message: "Unknown block"
            })
    }

    const fragments = parseFragments(context, (token) => token.type !== TokenType.BlockClose);

    return {
        type: "UnknownBlock",
        fragments
    }
}