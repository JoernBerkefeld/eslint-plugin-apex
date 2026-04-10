# `apex/error-no-empty-try`

> Disallow empty try or finally blocks

|                           |                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Type**                  | `problem`                                                                                              |
| **recommended**           | `error`                                                                                                |
| **strict**                | `error`                                                                                                |
| **security** (profile)    | —                                                                                                      |
| **performance** (profile) | —                                                                                                      |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#emptytryorfinallyblock) |

## Why

Disallow empty try or finally blocks

## PMD relationship

Closest PMD rule name(s): **EmptyTryOrFinallyBlock**

## Options

This rule has no configuration options.

## Report messages

| Message ID     | Text                                                                  |
| -------------- | --------------------------------------------------------------------- |
| `emptyTry`     | try block is empty. Add code that may throw exceptions.               |
| `emptyFinally` | finally block is empty. Add cleanup code or remove the finally block. |

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
rules: { 'apex/error-no-empty-try': 'off' }
```
