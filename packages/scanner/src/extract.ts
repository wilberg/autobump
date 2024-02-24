import {Range} from "./types/range.ts";

export function extract(range: Range, source: string, offset: [start: number, end: number] = [0, 0]): string {
    return source.slice(range[0] + offset[0], range[1] + offset[1]);
}
