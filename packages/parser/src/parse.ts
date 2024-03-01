import { type Token } from '@tagup/scanner';
import { type Program } from "./types/program";
import { type Context } from './types/context';
import { parseFragments } from './parse-fragments';

export function parse(tokens: Token[]): Program {
    const context: Context = {
        tokens,
        errors: [],
        index: 0
    };

    const fragments = parseFragments(context);

    context.errors.forEach((error) => console.error(error.message));

    return {
        type: "Program",
        from: fragments[0].from,
        to: fragments[fragments.length - 1].to,
        fragments
    }
}