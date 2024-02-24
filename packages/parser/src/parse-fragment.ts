import { Token, TokenType } from "@tagup/scanner";
import { consume } from "./consume";
import { Context } from "./types/context";
import { Fragment } from "./types/fragment";
import { Constant } from "./types/constant";
import { peek } from "./peek";
import { Tag } from "./types/tag";
import { parseExpression } from "./parse-expression";
import { parseBlock } from "./parse-block";

export function parseFragment(context: Context, predicate?: (token: Token) => boolean, message?: string): Fragment {
    const fragment: Fragment = {
        type: "Fragment",
        from: 0,
        to: 0,
        content: []
    }


    let token = consume(context);
    while (context.index <= context.tokens.length && (!predicate || predicate(token))) {
        switch (token.type) {
            case TokenType.Constant:
                fragment.content.push({
                    type: "Constant",
                    from: token.range[0],
                    to: token.range[1],
                    value: token.value
                } as Constant)
                break;
            case TokenType.DelimiterLeft:
                token = peek(context);
                if (token.type === TokenType.BlockOpen) {
                    fragment.content.push(parseBlock(context))
                } else if (token.type !== TokenType.BlockClose && token.type !== TokenType.BlockAlternate) {
                    const expression = parseExpression(context);
                    const closer = consume(context, { type: TokenType.DelimiterRight, message: `Expected tag closer.` });
                    fragment.content.push({
                        type: "Tag",
                        expression,
                        from: token.range[0],
                        to: closer.range[1]
                    } as Tag)
                }
                break;
        }

        token = consume(context)
    }

    if (!token && message) {
        context.errors.push({message});
    }

    return fragment;
}
