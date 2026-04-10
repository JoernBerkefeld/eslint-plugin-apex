# `apex/error-no-empty-catch`

> Disallow empty catch blocks

|                           |                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                       |
| **recommended**           | `error`                                                                                         |
| **strict**                | `error`                                                                                         |
| **security** (profile)    | —                                                                                               |
| **performance** (profile) | —                                                                                               |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#emptycatchblock) |

## Why

Disallow empty catch blocks

## PMD relationship

Closest PMD rule name(s): **EmptyCatchBlock**

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "allowCommentedBlocks": {
        "type": "boolean",
        "default": false
      },
      "allowExceptionNameRegex": {
        "type": "string",
        "default": "^(ignored|expected)$"
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID   | Text                                                              |
| ------------ | ----------------------------------------------------------------- |
| `emptyCatch` | Catch block for '{{type}}' is empty. Handle or log the exception. |

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
rules: { 'apex/error-no-empty-catch': 'off' }
```
