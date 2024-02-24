import {isLetter} from "./is-letter.ts";
import {isNumber} from "./is-number.ts";

export function isLetterOrNumber(value: string) {
    return isLetter(value) || isNumber(value);
}
