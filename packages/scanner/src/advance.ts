import {Range} from "./types/range.ts";

export function advance(range: Range): Range {
    range[1]++;
    return range;
}
