import { IfBlock } from "@tagup/parser/src/types/if-block";
import { Adapter } from "./types/adapter"
import { ForBlock } from "@tagup/parser/src/types/for-block";
import { AstNode } from "@tagup/parser/src/types/ast-node";
import { Constant } from "@tagup/parser/src/types/constant";
import { Identifier } from "@tagup/parser/src/types/identifier";
import { Literal } from "@tagup/parser/src/types/literal";
import { Member } from "@tagup/parser/src/types/member";
import { Tag } from "@tagup/parser/src/types/tag";
import { Binary } from "@tagup/parser/src/types/binary";
import { Unary } from "@tagup/parser/src/types/unary";
import { Grouping } from "@tagup/parser/src/types/grouping";
import { Call } from "@tagup/parser/src/types/call";
import { List } from "@tagup/parser/src/types/list";
import { Use } from "@tagup/parser/src/types/use";

const transpileIf = (node: IfBlock, prefix: string | null = "data", ignorePrefix: string[] = []) => {
    const fragment = node.fragments.map(subnode => transpile(subnode, prefix, ignorePrefix)).join('');
    const alternate = node.alternate ? node.alternate.map(subnode => transpile(subnode, prefix, ignorePrefix)).join('') : ''
  
    let buffer = '${';
    buffer += `${transpile(node.test, prefix, ignorePrefix)}?\`${fragment}\`:\`${alternate}\``
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
        case "Use":
            const use = node as Use;
            buffer += `"use: ${use.path}"`;
            break;
        case "List":
            const list = node as List;
            buffer += `[${list.items.map(item => transpile(item, prefix, ignorePrefix)).join(',')}]`;
            break;
        case "Call":
            const call = node as Call;
            const callee = transpile(call.callee, prefix, ignorePrefix);
            const args = call.arguments.map(arg => transpile(arg, prefix, ignorePrefix)).join(',');
            buffer += `${callee}(${args})`;
            break;
        case "Grouping":
            const grouping = node as Grouping;
            buffer += `(${transpile(grouping.expression, prefix, ignorePrefix)})`
            break;
        case "Unary":
            const unary = node as Unary;
            const unaryRight = transpile(unary.right, prefix, ignorePrefix)
            buffer += `${unary.operator}${unaryRight}`;
            break;
        case "Binary":
            const binary = node as Binary;
            const binaryLeft = transpile(binary.left, prefix, ignorePrefix);
            const binaryRight = transpile(binary.right, prefix, ignorePrefix)
            buffer += `${binaryLeft}${binary.operator}${binaryRight}`;
            break;
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