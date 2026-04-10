# `apex/design-no-unused-method`

> Detect private methods that are never called within the class

|                           |                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                             |
| **recommended**           | `off`                                                                                    |
| **strict**                | `error`                                                                                  |
| **security** (profile)    | —                                                                                        |
| **performance** (profile) | —                                                                                        |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#unusedmethod) |

## Why

Detect private methods that are never called within the class

## PMD relationship

Closest PMD rule name(s): **UnusedMethod**

## Options

This rule has no configuration options.

## Report messages

| Message ID     | Text                                                                                    |
| -------------- | --------------------------------------------------------------------------------------- |
| `unusedMethod` | Method '{{name}}' is private but appears to be unused. Remove it or make it accessible. |

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
rules: { 'apex/design-no-unused-method': 'off' }
```
