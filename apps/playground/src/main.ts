import { JSAdapter, compile } from '@tagup/compiler';

const output = compile("Hello {name}!", JSAdapter)
console.log(output);