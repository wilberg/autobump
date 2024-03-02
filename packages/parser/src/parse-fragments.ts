import { Token, TokenType } from "@tagup/scanner";
import { consume } from "./consume";
import { Context } from "./types/context";
import { Constant } from "./types/constant";
import { peek } from "./peek";
import { Tag } from "./types/tag";
import { parseExpression } from "./parse-expression";
import { parseBlock } from "./parse-block";
import { AstNode } from "./types/ast-node";

export function parseFragments(context: Context, predicate?: (token: Token) => boolean, message?: string): AstNode<string>[] {
    const fragments: AstNode<string>[] = [];
    let token: Token = consume(context)!;
    while (context.index <= context.tokens.length && (!predicate || predicate(token))) {
        switch (token.type) {
            case TokenType.Constant:
                fragments.push({
                    type: "Constant",
                    value: token.value
                } as Constant)
                break;
            case TokenType.DelimiterLeft:
                token = peek(context)!;
                if (token.type === TokenType.BlockOpen) {
                    fragments.push(parseBlock(context))
                } else if (token.type !== TokenType.BlockClose && token.type !== TokenType.BlockAlternate) {
                    const expression = parseExpression(context);
                    consume(context, { type: TokenType.DelimiterRight, message: `Expected tag closer.` })!; // Consume the right delimiter.
                    fragments.push({
                        type: "Tag",
                        expression,
                    } as Tag)
                }
                break;
        }

        token = consume(context)!;
    }

    if (!token && message) {
        context.errors.push({message});
    }

    return fragments;
}
