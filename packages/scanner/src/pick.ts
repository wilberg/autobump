import {Range} from "./types/range.ts";

export function pick(range: Range, source: string) {
    return source.charAt(range[1])
}
