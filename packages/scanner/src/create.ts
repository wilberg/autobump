import {Range} from "./types/range.ts";
import {Token} from "./types/token.ts";
import {extract} from "./extract.ts";
import { TokenType } from "./types/token-type.ts";

export function create(type: TokenType, source: string, range: Range, offset: [start: number, end: number] = [0, 0]): Token {
    return {
        type,
        value: extract(range, source, offset),
        range: [range[0], range[1]]
    }
}
