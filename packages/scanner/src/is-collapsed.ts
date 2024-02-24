import {Range} from "./types/range.ts";

export function isCollapsed(range: Range) {
    return range[0] === range[1];
}
