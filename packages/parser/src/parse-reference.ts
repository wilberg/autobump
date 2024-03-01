import { TokenType } from "@tagup/scanner";
import { consume } from "./consume";
import { Context } from "./types/context";
import { Identifier } from "./types/identifier";
import { Member } from "./types/member";
import { peek } from "./peek";

export function parseReference(context: Context): Identifier|Member {
    const token = consume(context, { type: TokenType.Identifier, message: "Identifier expected." })!;

    let expression: Identifier|Member = {
        type: "Identifier",
        from: token.range[0],
        to: token.range[1],
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

    return expression;
}