import { Token } from "@tagup/scanner"

export type Context = {
    tokens: Token[],
    errors: { message: string }[],
    index: 0
}