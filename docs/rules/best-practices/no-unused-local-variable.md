# `apex/best-no-unused-local-variable`

> Detects local variables that are declared but never read

|                           |                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Type**                  | `suggestion`                                                                                           |
| **recommended**           | `off`                                                                                                  |
| **strict**                | `error`                                                                                                |
| **security** (profile)    | —                                                                                                      |
| **performance** (profile) | —                                                                                                      |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#unusedlocalvariable) |

## Why

Detects local variables that are declared but never read

## PMD relationship

Closest PMD rule name(s): **UnusedLocalVariable**

## Options

This rule has no configuration options.

## Report messages

| Message ID       | Text                                                  |
| ---------------- | ----------------------------------------------------- |
| `unusedVariable` | Local variable '{{name}}' is declared but never used. |

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
rules: { 'apex/best-no-unused-local-variable': 'off' }
```
