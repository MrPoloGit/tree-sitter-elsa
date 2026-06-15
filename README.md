# tree-sitter-elsa

[Tree-sitter](https://tree-sitter.github.io) grammar for [Elsa](https://github.com/ucsd-progsys/elsa) — UCSD's lambda calculus teaching language (`.lc` files).

## Usage

```bash
npm install tree-sitter-elsa
```

```js
const Parser = require('tree-sitter');
const Elsa = require('tree-sitter-elsa');

const parser = new Parser();
parser.setLanguage(Elsa);

const tree = parser.parse(`
let id = \\x -> x
eval id_id :
  id id
  =d> (\\x -> x) (\\x -> x)
  =b> \\x -> x
`);
console.log(tree.rootNode.toString());
```

## Grammar coverage

| Construct | Example |
|-----------|---------|
| Let bindings | `let id = \x -> x` |
| Eval blocks | `eval name : term =b> term` |
| Conf blocks | `conf name : term =b> term` |
| Lambda | `\x y -> body` |
| Application | `f x y` (left-associative) |
| Parentheses | `(f x)` |
| All step ops | `=a>` `=b>` `=e>` `=d>` `=n>` `=p>` `=*>` `=~>` `=n*>` `=p*>` |
| Normal-form modifiers | `=b:w>` `=b:s>` `=b:h>` |
| Line comments | `-- comment` |
| Block comments | `{- comment -}` |
| Identifiers | letters, digits, `_`, `#`, `'` |

## Development

```bash
npm install
tree-sitter generate
tree-sitter test
```
