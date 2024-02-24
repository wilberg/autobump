import {Range} from "./range.ts";
import { TokenType } from "./token-type.ts";

export type Token = {
    type: TokenType;
    value: string;
    range: Range;
};
