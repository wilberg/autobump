import { scan } from '@tagup/scanner';
import { parse } from '@tagup/parser';
import { Adapter } from './types/adapter';
import { JSAdapter } from '.';

export function compile<T = string>(source: string, adapter: Adapter<T> = JSAdapter as Adapter<T>): T {
    return adapter(parse(scan(source, ['for', 'if', 'else', 'in', 'use'])));
}
