import { type Token } from '@tagup/scanner';
import { type Program } from "./types/program";
import { type Context } from './types/context';
import { parseFragment } from './parse-fragment';

export function parse(tokens: Token[]): Program {
    const context: Context = {
        tokens,
        errors: [],
        index: 0
    };

    const fragment = parseFragment(context);

    context.errors.forEach((error) => console.error(error.message));

    return {
        type: "Program",
        from: fragment.from,
        to: fragment.to,
        fragment
    }
}