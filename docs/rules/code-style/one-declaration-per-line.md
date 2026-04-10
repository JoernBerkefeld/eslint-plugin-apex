# `apex/style-one-declaration-per-line`

> Declare only one variable per statement

|                           |                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                         |
| **recommended**           | `warn`                                                                                               |
| **strict**                | `error`                                                                                              |
| **security** (profile)    | —                                                                                                    |
| **performance** (profile) | —                                                                                                    |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#onedeclarationperline) |

## Why

Declare only one variable per statement

## PMD relationship

Closest PMD rule name(s): **OneDeclarationPerLine**

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "strictMode": {
        "type": "boolean",
        "default": false
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID            | Text                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------- |
| `multipleDeclarators` | Declare only one variable per statement. Found {{count}} variables declared together. |

## Examples

Illustrative patterns only — adjust to your org’s style. Refer to `tests/rules.test.js` for cases the implementation covers.

```apex
// Invalid or risky (depends on rule)
// …
```

```apex
// Preferred / compliant
// …
```

## When to disable

```js
// eslint.config.js
rules: { 'apex/style-one-declaration-per-line': 'off' }
```
