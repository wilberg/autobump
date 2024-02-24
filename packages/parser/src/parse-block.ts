import { TokenType } from "@tagup/scanner";
import { consume } from "./consume";
import { parseFragment } from "./parse-fragment";
import { Block } from "./types/block";
import { Context } from "./types/context";
import { ForBlock } from "./types/for-block";
import { parseReference } from "./parse-reference";
import { parseExpression } from "./parse-expression";
import { IfBlock } from "./types/if-block";
import { Fragment } from "./types/fragment";

export function parseBlock(context: Context): Block<string> {
    const opener = consume(context);
    
    switch (opener.value) {
        case "for":
            const variable = consume(context, { type: TokenType.Identifier, message: "Exected identifier" });
            consume(context, { type: TokenType.Reserved, value: "as", message: "Expected reserved keyword 'as' following variable"});
            const iterator = parseReference(context);

            const forFragment = parseFragment(context, (token) => token.type !== TokenType.BlockClose || token.value !== 'for');
            
            return {
                type: "ForBlock",
                iterator,
                variable: {
                    type: "Identifier",
                    name: variable.value
                },
                from: 0,
                to: 0,
                fragment: forFragment
            } as ForBlock
        case "if":
            const expression = parseExpression(context);

            let hasAlternate = false;
            const ifFragment = parseFragment(context, (token) => {
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

            let alternate: Fragment|null = null;
            if (hasAlternate) {
                // Also collect the alternate
                alternate = parseFragment(context, (token) => {
                    return token.type !== TokenType.BlockClose || token.value !== 'if'
                }, "If statement never closed");
            }

            return {
                type: "IfBlock",
                from: 0,
                to: 0,
                test: expression,
                fragment: ifFragment,
                alternate: alternate
            } as IfBlock
        default:
            context.errors.push({
                message: "Unknown block"
            })
    }

    const fragment = parseFragment(context, (token) => token.type !== TokenType.BlockClose);

    return {
        type: "UnknownBlock",
        from: 0,
        to: 0,
        fragment
    }
}