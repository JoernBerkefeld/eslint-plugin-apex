# `apex/perf-no-debug-statements`

> Remove or gate System.debug() calls in production code

|                           |                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                     |
| **recommended**           | `off`                                                                            |
| **strict**                | `error`                                                                          |
| **security** (profile)    | —                                                                                |
| **performance** (profile) | `error`                                                                          |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html) |

## Why

Remove or gate System.debug() calls in production code

## PMD relationship

Closest PMD rule name(s): **AvoidDebugStatements**

## Options

This rule has no configuration options.

## Report messages

| Message ID       | Text                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| `debugStatement` | System.debug() is called. Remove debug statements from production code or gate them with custom labels. |

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
rules: { 'apex/perf-no-debug-statements': 'off' }
```
