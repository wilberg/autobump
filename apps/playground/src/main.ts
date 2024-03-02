import { JSAdapter, compile } from '@tagup/compiler';

const source = `{ echo(user) }`;

const output = compile(source, JSAdapter);
console.log(output);