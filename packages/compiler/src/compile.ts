import { scan } from '@tagup/scanner';
import { parse } from '@tagup/parser';
import { Adapter } from './types/adapter';

export function compile<T>(source: string, adapter: Adapter<T>): T {
    return adapter(parse(scan(source, ['for', 'if', 'else', 'in'])));
}
