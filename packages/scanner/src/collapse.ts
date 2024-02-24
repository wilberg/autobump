import {Range} from "./types/range.ts";

export function collapse(range: Range) {
    range[0] = range[1];
}
