import { scan } from '@tagup/scanner';
import { parse } from '@tagup/parser';
import { Adapter } from './types/adapter';

export function compile<T>(source: string, adapter: Adapter<T>): T {
    const tokens = scan(source, ['for', 'if', 'else', 'in']);
    const program = parse(tokens);
    return adapter(program);
}
