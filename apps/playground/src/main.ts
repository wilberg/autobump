import { JSAdapter, compile } from '@tagup/compiler';

const source = `
{#if person.age + 10 > 18}
You are old enough.
{:else}
You are too young.
{/if}
`;

const output = compile(source, JSAdapter);
console.log(output);