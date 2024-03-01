import {Range} from "./types/range.ts";
import {Token} from "./types/token.ts";
import {create} from "./create.ts";
import {advance} from "./advance.ts";
import {collapse} from "./collapse.ts";
import {pick} from "./pick.ts";
import {isLetter} from "./is-letter.ts";
import {isNumber} from "./is-number.ts";
import {extract} from "./extract.ts";
import {pointer} from "./pointer.ts";
import {isCollapsed} from "./is-collapsed.ts";
import {isWhitespace} from "./is-whitespace.ts";
import {isLetterOrNumber} from "./is-letter-or-number.ts";
import {TokenType} from "./types/token-type.ts";
import { peek } from "./peek.ts";

export function scan(source: string, reserved: readonly string[] = []) {
    const tokens: Token[] = [];
    const range: Range = [0, 0];

    while (pointer(range) < source.length) {
        let char = pick(range, source);

        if (char === '{') {
            if (!isCollapsed(range)) {
                tokens.push(create(TokenType.Constant, source, range));
            }
            collapse(range);
            advance(range);
            tokens.push(create(TokenType.DelimiterLeft, source, range));
            collapse(range);

            while (pick(range, source) !== '}') {
                char = pick(range, source);
                advance(range);

                switch (char) {
                    case "\"":
                        advance(range);
                        while (pick(range, source) !== "\"" && pointer(range) < source.length) {
                            advance(range);
                        }
                        advance(range);
                        tokens.push(create(TokenType.String, source, range, [1, -1]));
                        break;
                    case ",":
                        tokens.push(create(TokenType.Comma, source, range));
                        break;
                    case ".":
                        tokens.push(create(TokenType.Dot, source, range));
                        break;
                    case "+":
                        tokens.push(create(TokenType.Plus, source, range));
                        break;
                    case "-":
                        tokens.push(create(TokenType.Minus, source, range));
                        break;
                    case "*":
                        tokens.push(create(TokenType.Star, source, range));
                        break;
                    case "!":
                        tokens.push(create(TokenType.Bang, source, range));
                        break;
                    case ">":
                        tokens.push(create(TokenType.GreaterThan, source, range));
                        break;
                    case "<":
                        tokens.push(create(TokenType.LessThan, source, range));
                        break;
                    case "(":
                        tokens.push(create(TokenType.ParenthesisLeft, source, range));
                        break;
                    case ")":
                        tokens.push(create(TokenType.ParenthesisRight, source, range));
                        break;
                    case "#":
                        if (isLetter(pick(range, source))) {
                            char = pick(range, source);
                            while (isLetter(char) || isNumber(char)) {
                                char = pick(advance(range), source);
                            }

                            tokens.push(create(TokenType.BlockOpen, source, range, [1, 0]));
                        } else {
                            tokens.push(create(TokenType.Hash, source, range));
                        }
                        break;
                    case "/":
                        if (isLetter(pick(range, source))) {
                            char = pick(range, source);
                            while (isLetter(char) || isNumber(char)) {
                                char = pick(advance(range), source);
                            }

                            tokens.push(create(TokenType.BlockClose, source, range, [1, 0]));
                        } else {
                            tokens.push(create(TokenType.Slash, source, range));
                        }
                        break;
                    case ":":
                        if (isLetter(pick(range, source))) {
                            char = pick(range, source);
                            while (isLetter(char) || isNumber(char)) {
                                char = pick(advance(range), source);
                            }

                            tokens.push(create(TokenType.BlockAlternate, source, range, [1, 0]));
                        } else {
                            tokens.push(create(TokenType.Colon, source, range));
                        }
                        break;
                    default:
                        if (isLetter(char)) {
                            while (isLetterOrNumber(pick(range, source))) {
                                advance(range);
                            }

                            const value = extract(range, source);
                            tokens.push(create(reserved.includes(value) ? TokenType.Reserved : TokenType.Identifier, source, range));
                        } else if (isNumber(char)) {
                            while (isNumber(pick(range, source))) {
                                advance(range);
                            }
                            tokens.push(create(TokenType.Number, source, range));
                        } else if (!isWhitespace(char)) {
                            console.log('Unexpected character:', char);
                        }
                        break;
                }

                collapse(range);
            }

            advance(range);
            tokens.push(create(TokenType.DelimiterRight, source, range));
            collapse(range);
        } else {
            advance(range);
        }
    }

    if (!isCollapsed(range)) {
        tokens.push(create(TokenType.Constant, source, range));
    }

    return tokens;
}
