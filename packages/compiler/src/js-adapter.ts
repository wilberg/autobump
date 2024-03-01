import { IfBlock } from "@tagup/parser/src/types/if-block";
import { Adapter } from "./types/adapter"
import { ForBlock } from "@tagup/parser/src/types/for-block";
import { AstNode } from "@tagup/parser/src/types/ast-node";
import { Constant } from "@tagup/parser/src/types/constant";
import { Identifier } from "@tagup/parser/src/types/identifier";
import { Literal } from "@tagup/parser/src/types/literal";
import { Member } from "@tagup/parser/src/types/member";
import { Tag } from "@tagup/parser/src/types/tag";

const transpileIf = (node: IfBlock, prefix: string | null = "data", ignorePrefix: string[] = []) => {
    const fragment = node.fragments.map(subnode => transpile(subnode, prefix, ignorePrefix)).join('');
    const alternate = node.alternate ? node.alternate.map(subnode => transpile(subnode, prefix, ignorePrefix)).join('') : ''
  
    let buffer = '${';
    buffer += `${transpile(node.test, prefix, ignorePrefix)} ? \`${fragment}\` : \`${alternate}\``
    buffer += '}'
  
    return buffer;
}
  
const transpileLoop = (node: ForBlock, prefix: string | null = "data", ignorePrefix: string[] = []) => {
    const variable = transpile(node.variable, null);
    const iterator = transpile(node.iterator, prefix, ignorePrefix);
    const fragment = node.fragments.map(subnode => transpile(subnode, prefix, [...ignorePrefix, variable])).join('');

    let buffer = '${';

        buffer += `(() => {`
        buffer += `let output='';`
        buffer += `for (const ${variable} of ${iterator}) {`
            buffer += `output += \`${fragment}\``
        buffer += `}`
        buffer += `return output`;
        buffer += `})()`

    buffer += '}'

    return buffer;
}

const transpile = (node: AstNode<string>, prefix: string | null = "data", ignorePrefix: string[] = []) => {
    let buffer = ``;
    switch (node.type) {
        case "Constant":
            const constant = node as Constant;
            buffer += `${constant.value}`;
            break;
        case "Tag":
            const tag = node as Tag;
            const tagContent = transpile(tag.expression, prefix, ignorePrefix);
            buffer += `\${${tagContent}}`
            break;
        case "Identifier":
            const identifier = node as Identifier;
            buffer += `${prefix != null && !ignorePrefix.includes(identifier.name) ? `${prefix}.` : ''}${identifier.name}`;
            break;
        case "Member":
            const member = node as Member;
            buffer += `${transpile(member.object, prefix, ignorePrefix)}.${transpile(member.property, null, ignorePrefix)}`
            break;
        case "Literal":
            const literal = node as Literal;
            if (literal.kind === "string") {
                buffer += `"${literal.value}"`;
            } else {
                buffer += `${literal.value}`
            }
            break;
        case "ForBlock":
            buffer += transpileLoop(node as ForBlock, prefix, ignorePrefix);
            break;
        case "IfBlock":
            buffer += transpileIf(node as IfBlock, prefix, ignorePrefix);
            break;
    }
    return buffer;
}

export const JSAdapter: Adapter<string> = (program) => {
    let buffer = `(data)=>\``;

    program.fragments.forEach(node => {
      buffer += transpile(node);
    });

    buffer += `\`;`;

    return buffer;
}