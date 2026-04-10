# `apex/doc-require-apexdoc`

> Require ApexDoc comments on public and global classes, methods, and properties

|                           |                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| **Type**                  | `suggestion`                                                                               |
| **recommended**           | `off`                                                                                      |
| **strict**                | `error`                                                                                    |
| **security** (profile)    | —                                                                                          |
| **performance** (profile) | —                                                                                          |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_documentation.html#apexdoc) |

## Why

Require ApexDoc comments on public and global classes, methods, and properties

## PMD relationship

Closest PMD rule name(s): **ApexDoc**

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "reportPrivate": {
        "type": "boolean",
        "default": false
      },
      "reportProtected": {
        "type": "boolean",
        "default": false
      },
      "reportMissingDescription": {
        "type": "boolean",
        "default": true
      },
      "reportProperty": {
        "type": "boolean",
        "default": true
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID   | Text                                                             |
| ------------ | ---------------------------------------------------------------- |
| `missingDoc` | {{kind}} '{{name}}' is missing an ApexDoc comment (/\*_ ... _/). |

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
rules: { 'apex/doc-require-apexdoc': 'off' }
```
