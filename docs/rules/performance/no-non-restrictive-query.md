# `apex/perf-no-non-restrictive-query`

> SOQL queries should include a WHERE clause to limit results

|                           |                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                        |
| **recommended**           | `error`                                                                          |
| **strict**                | `error`                                                                          |
| **security** (profile)    | —                                                                                |
| **performance** (profile) | `error`                                                                          |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html) |

## Why

SOQL queries should include a WHERE clause to limit results

## PMD relationship

Closest PMD rule name(s): **AvoidNonRestrictiveQueries**

### Differences from PMD

Aligns with **AvoidNonRestrictiveQueries**; **WherelessSOQLQuery** is accepted as a legacy alias.

## Options

This rule has no configuration options.

## Report messages

| Message ID      | Text                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------- |
| `noWhereClause` | SOQL query is missing a WHERE clause. Unbounded queries can breach governor limits in large orgs. |

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
rules: { 'apex/perf-no-non-restrictive-query': 'off' }
```
