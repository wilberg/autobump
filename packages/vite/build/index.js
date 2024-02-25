var n = /* @__PURE__ */ ((e) => (e.String = "string", e.Number = "number", e.Comma = "comma", e.Colon = "colon", e.Dot = "dot", e.Plus = "plus", e.GreaterThan = "greater-than", e.LessThan = "less-than", e.ParenthesisLeft = "parenthesis-left", e.ParenthesisRight = "parenthesis-right", e.BlockOpen = "block-open", e.BlockAlternate = "block-alternate", e.BlockClose = "block-close", e.Hash = "hash", e.Slash = "slash", e.DelimiterLeft = "delimiter-left", e.DelimiterRight = "delimiter-right", e.Constant = "constant", e.Identifier = "identifier", e.Reserved = "reserved", e))(n || {});
function C(e, a, r = [0, 0]) {
  return a.slice(e[0] + r[0], e[1] + r[1]);
}
function i(e, a, r, t = [0, 0]) {
  return {
    type: e,
    value: C(r, a, t),
    range: [r[0], r[1]]
  };
}
function p(e) {
  return e[1]++, e;
}
function $(e) {
  e[0] = e[1];
}
function f(e, a) {
  return a.charAt(e[1]);
}
function m(e) {
  return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_";
}
function k(e) {
  return e >= "0" && e <= "9";
}
function B(e) {
  return e[1];
}
function y(e) {
  return e[0] === e[1];
}
function R(e) {
  return e === " " || e === "	" || e === `
` || e === "\r";
}
function E(e) {
  return m(e) || k(e);
}
function A(e, a = []) {
  const r = [], t = [0, 0];
  for (; B(t) < e.length; ) {
    let s = f(t, e);
    if (s === "{") {
      for (y(t) || r.push(i(n.Constant, e, t)), $(t), p(t), r.push(i(n.DelimiterLeft, e, t)), $(t); f(t, e) !== "}"; ) {
        switch (s = f(t, e), p(t), s) {
          case '"':
            for (p(t); f(t, e) !== '"' && B(t) < e.length; )
              p(t);
            p(t), r.push(i(n.String, e, t, [1, -1]));
            break;
          case ",":
            r.push(i(n.Comma, e, t));
            break;
          case ".":
            r.push(i(n.Dot, e, t));
            break;
          case ">":
            r.push(i(n.GreaterThan, e, t));
            break;
          case "<":
            r.push(i(n.LessThan, e, t));
            break;
          case "(":
            r.push(i(n.ParenthesisLeft, e, t));
            break;
          case ")":
            r.push(i(n.ParenthesisRight, e, t));
            break;
          case "#":
            if (m(f(t, e))) {
              for (s = f(t, e); m(s) || k(s); )
                s = f(p(t), e);
              r.push(i(n.BlockOpen, e, t, [1, 0]));
            } else
              r.push(i(n.Hash, e, t));
            break;
          case "/":
            if (m(f(t, e))) {
              for (s = f(t, e); m(s) || k(s); )
                s = f(p(t), e);
              r.push(i(n.BlockClose, e, t, [1, 0]));
            } else
              r.push(i(n.Slash, e, t));
            break;
          case ":":
            if (m(f(t, e))) {
              for (s = f(t, e); m(s) || k(s); )
                s = f(p(t), e);
              r.push(i(n.BlockAlternate, e, t, [1, 0]));
            } else
              r.push(i(n.Colon, e, t));
            break;
          default:
            if (m(s)) {
              for (; E(f(t, e)); )
                p(t);
              const o = C(t, e);
              r.push(i(a.includes(o) ? n.Reserved : n.Identifier, e, t));
            } else if (k(s)) {
              for (; k(f(t, e)); )
                p(t);
              r.push(i(n.Number, e, t));
            } else
              R(s) || console.log("Unexpected character:", s);
            break;
        }
        $(t);
      }
      p(t), r.push(i(n.DelimiterRight, e, t)), $(t);
    } else
      p(t);
  }
  return y(t) || r.push(i(n.Constant, e, t)), r;
}
function c(e, a) {
  const r = e.tokens[e.index++];
  return a && r.type !== a.type && (!a.value || r.value === a.value) && e.errors.push({
    message: `[${r.type}]: ${a.message}`
  }), r;
}
function w(e, a = 0) {
  return e.tokens[e.index + a];
}
function I(e) {
  const a = c(e, { type: n.Identifier, message: "Identifier expected." });
  let r = {
    type: "Identifier",
    from: a.range[0],
    to: a.range[1],
    name: a.value
  };
  for (; w(e).type === n.Dot; ) {
    c(e);
    const t = c(e, { type: n.Identifier, message: "Expected identifier" });
    r = {
      type: "Member",
      object: r,
      property: {
        type: "Identifier",
        name: t.value
      }
    };
  }
  return r;
}
function L(e) {
  const a = w(e);
  let r = {
    type: "UnknownExpression",
    from: a.range[0],
    to: a.range[1]
  };
  switch (a.type) {
    case n.Identifier:
      r = I(e);
      break;
    case n.String:
      c(e), r = {
        type: "Literal",
        kind: "string",
        value: a.value
      };
      break;
    case n.Number:
      c(e), r = {
        type: "Literal",
        kind: "number",
        value: +a.value
      };
      break;
  }
  return r;
}
function F(e) {
  switch (c(e).value) {
    case "for":
      const t = c(e, { type: n.Identifier, message: "Exected identifier" });
      c(e, { type: n.Reserved, value: "as", message: "Expected reserved keyword 'as' following variable" });
      const s = I(e), o = d(e, (h) => h.type !== n.BlockClose || h.value !== "for");
      return {
        type: "ForBlock",
        iterator: s,
        variable: {
          type: "Identifier",
          name: t.value
        },
        from: 0,
        to: 0,
        fragment: o
      };
    case "if":
      const l = L(e);
      let g = !1;
      const v = d(e, (h) => h.type === n.BlockAlternate ? (g = !0, !1) : h.type !== n.BlockClose || h.value !== "if", "Unclosed if statement");
      c(e, {
        type: n.DelimiterRight,
        message: "Expected right delimiter"
      });
      let b = null;
      return g && (b = d(e, (h) => h.type !== n.BlockClose || h.value !== "if", "If statement never closed")), {
        type: "IfBlock",
        from: 0,
        to: 0,
        test: l,
        fragment: v,
        alternate: b
      };
    default:
      e.errors.push({
        message: "Unknown block"
      });
  }
  return {
    type: "UnknownBlock",
    from: 0,
    to: 0,
    fragment: d(e, (t) => t.type !== n.BlockClose)
  };
}
function d(e, a, r) {
  const t = {
    type: "Fragment",
    from: 0,
    to: 0,
    content: []
  };
  let s = c(e);
  for (; e.index <= e.tokens.length && (!a || a(s)); ) {
    switch (s.type) {
      case n.Constant:
        t.content.push({
          type: "Constant",
          from: s.range[0],
          to: s.range[1],
          value: s.value
        });
        break;
      case n.DelimiterLeft:
        if (s = w(e), s.type === n.BlockOpen)
          t.content.push(F(e));
        else if (s.type !== n.BlockClose && s.type !== n.BlockAlternate) {
          const o = L(e), l = c(e, { type: n.DelimiterRight, message: "Expected tag closer." });
          t.content.push({
            type: "Tag",
            expression: o,
            from: s.range[0],
            to: l.range[1]
          });
        }
        break;
    }
    s = c(e);
  }
  return !s && r && e.errors.push({ message: r }), t;
}
function S(e) {
  const a = {
    tokens: e,
    errors: [],
    index: 0
  }, r = d(a);
  return a.errors.forEach((t) => console.error(t.message)), {
    type: "Program",
    from: r.from,
    to: r.to,
    fragment: r
  };
}
function j(e, a = D) {
  return a(S(A(e, ["for", "if", "else", "in"])));
}
const N = (e, a = "data", r = []) => {
  const t = e.fragment.content.map((l) => u(l, a, r)).join(""), s = e.alternate ? e.alternate.content.map((l) => u(l, a, r)).join("") : "";
  let o = "${";
  return o += `${u(e.test, a, r)} ? \`${t}\` : \`${s}\``, o += "}", o;
}, U = (e, a = "data", r = []) => {
  const t = u(e.variable, null), s = u(e.iterator, a, r), o = e.fragment.content.map((g) => u(g, a, [...r, t])).join("");
  let l = "${";
  return l += "(() => {", l += "let output='';", l += `for (const ${t} of ${s}) {`, l += `output += \`${o}\``, l += "}", l += "return output", l += "})()", l += "}", l;
}, u = (e, a = "data", r = []) => {
  let t = "";
  switch (e.type) {
    case "Constant":
      t += `${e.value}`;
      break;
    case "Tag":
      const l = u(e.expression, a, r);
      t += `\${${l}}`;
      break;
    case "Identifier":
      const g = e;
      t += `${a != null && !r.includes(g.name) ? `${a}.` : ""}${g.name}`;
      break;
    case "Member":
      const v = e;
      t += `${u(v.object, a, r)}.${u(v.property, null, r)}`;
      break;
    case "Literal":
      const b = e;
      b.kind === "string" ? t += `"${b.value}"` : t += `${b.value}`;
      break;
    case "ForBlock":
      t += U(e, a, r);
      break;
    case "IfBlock":
      t += N(e, a, r);
      break;
  }
  return t;
}, D = (e) => {
  let a = "(data)=>`";
  return e.fragment.content.forEach((r) => {
    a += u(r);
  }), a += "`;", a;
}, O = () => ({
  name: "Tagup Plugin",
  transform(e, a) {
    var r;
    return ((r = a.split("/").pop()) == null ? void 0 : r.split(".").pop()) === "tu" ? `export default ${j(e, D)}` : e;
  }
});
export {
  O as default
};
