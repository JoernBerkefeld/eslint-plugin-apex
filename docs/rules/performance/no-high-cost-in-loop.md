# `apex/perf-no-high-cost-in-loop`

> Avoid high-cost Apex calls inside loops

|                           |                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                        |
| **recommended**           | `error`                                                                          |
| **strict**                | `error`                                                                          |
| **security** (profile)    | —                                                                                |
| **performance** (profile) | `error`                                                                          |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html) |

## Why

Avoid high-cost Apex calls inside loops

## PMD relationship

Closest PMD rule name(s): **OperationWithHighCostInLoop**

### Differences from PMD

Maps to PMD **OperationWithHighCostInLoop** in current catalogs; **AvoidSoqlInLoops** is kept as a legacy alias key in the PMD converter for older XML.

## Options

This rule has no configuration options.

## Report messages

| Message ID       | Text                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `highCostInLoop` | '{{callee}}' inside a loop is expensive. Bulkify by collecting items and calling outside the loop. |

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
rules: { 'apex/perf-no-high-cost-in-loop': 'off' }
```
