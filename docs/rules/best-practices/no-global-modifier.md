# `apex/best-no-global-modifier`

> Avoid 'global' class modifier — it permanently locks the public API in managed packages

|                           |                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Type**                  | `suggestion`                                                                                           |
| **recommended**           | `warn`                                                                                                 |
| **strict**                | `error`                                                                                                |
| **security** (profile)    | —                                                                                                      |
| **performance** (profile) | —                                                                                                      |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#avoidglobalmodifier) |

## Why

Avoid 'global' class modifier — it permanently locks the public API in managed packages

## PMD relationship

Closest PMD rule name(s): **AvoidGlobalModifier**

## Options

This rule has no configuration options.

## Report messages

| Message ID       | Text                                                                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `globalModifier` | '{{name}}' is declared global. Prefer public unless cross-namespace access is required, as global declarations in managed packages can never be removed. |

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
rules: { 'apex/best-no-global-modifier': 'off' }
```
