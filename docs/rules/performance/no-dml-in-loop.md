# `apex/perf-no-dml-in-loop`

> Avoid DML operations, SOQL queries, and governor-limited calls inside loops

|                           |                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                                  |
| **recommended**           | `error`                                                                                                    |
| **strict**                | `error`                                                                                                    |
| **security** (profile)    | —                                                                                                          |
| **performance** (profile) | `error`                                                                                                    |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html#operationwithlimitsinloop) |

## Why

Avoid DML operations, SOQL queries, and governor-limited calls inside loops

## PMD relationship

Closest PMD rule name(s): **OperationWithLimitsInLoop**

### Differences from PMD

Maps to PMD **OperationWithLimitsInLoop**; **AvoidDmlStatementsInLoops** remains a legacy alias for older rule XML.

## Options

This rule has no configuration options.

## Report messages

| Message ID       | Text                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `dmlInLoop`      | DML operation inside a loop hits governor limits. Collect records and DML outside the loop.   |
| `soqlInLoop`     | SOQL/SOSL query inside a loop hits governor limits. Use a single bulk query outside the loop. |
| `highCostInLoop` | Call to '{{callee}}' inside a loop hits governor limits. Move it outside the loop.            |

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
rules: { 'apex/perf-no-dml-in-loop': 'off' }
```
