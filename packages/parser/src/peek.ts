import { Token } from "@tagup/scanner";
import { Context } from "./types/context";

export function peek(context: Context, offset = 0): Token {
    return context.tokens[context.index + offset];
}