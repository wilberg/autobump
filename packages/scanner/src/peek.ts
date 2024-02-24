import {Range} from "./types/range.ts";

export function peek(range: Range, source: string, offset: number = 1) {
    return source.charAt(range[1] + offset);
}
