import { JSAdapter, compile } from '@tagup/compiler';

const source = `{ echo("Hello", [1, 2, 3]) }`;

const output = compile(source, JSAdapter);
console.log(output);