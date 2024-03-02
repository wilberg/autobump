import { JSAdapter, compile } from '@tagup/compiler';

const source = `{ use "../title" }`;

const output = compile(source, JSAdapter);
console.log(output);