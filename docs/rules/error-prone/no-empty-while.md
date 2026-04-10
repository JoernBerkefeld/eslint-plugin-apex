# `apex/error-no-empty-while`

> Disallow empty while loop bodies

|                           |                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                      |
| **recommended**           | `error`                                                                                        |
| **strict**                | `error`                                                                                        |
| **security** (profile)    | —                                                                                              |
| **performance** (profile) | —                                                                                              |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#emptywhilestmt) |

## Why

Disallow empty while loop bodies

## PMD relationship

Closest PMD rule name(s): **EmptyWhileStmt**

## Options

This rule has no configuration options.

## Report messages

| Message ID   | Text                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| `emptyWhile` | while loop has an empty body. Add meaningful logic or remove the loop. |

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
rules: { 'apex/error-no-empty-while': 'off' }
```
