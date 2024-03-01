import { JSAdapter, compile } from '@tagup/compiler';

const source = `
{ "hello" }
`;

const output = compile(source, JSAdapter);
console.log(output);