# `apex/error-no-empty-if`

> Disallow empty if statement bodies

|                           |                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                   |
| **recommended**           | `error`                                                                                     |
| **strict**                | `error`                                                                                     |
| **security** (profile)    | —                                                                                           |
| **performance** (profile) | —                                                                                           |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#emptyifstmt) |

## Why

Disallow empty if statement bodies

## PMD relationship

Closest PMD rule name(s): **EmptyIfStmt**

## Options

This rule has no configuration options.

## Report messages

| Message ID | Text                                                               |
| ---------- | ------------------------------------------------------------------ |
| `emptyIf`  | if statement has an empty body. Remove it or add meaningful logic. |

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
rules: { 'apex/error-no-empty-if': 'off' }
```
