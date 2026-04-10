# `apex/error-no-stateful-db-result`

> Avoid storing Database result types as instance variables in Database.Stateful batch classes

|                           |                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                                   |
| **recommended**           | `error`                                                                                                     |
| **strict**                | `error`                                                                                                     |
| **security** (profile)    | —                                                                                                           |
| **performance** (profile) | —                                                                                                           |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#avoidstatefuldatabaseresult) |

## Why

Avoid storing Database result types as instance variables in Database.Stateful batch classes

## PMD relationship

Closest PMD rule name(s): **AvoidStatefulDatabaseResult**

### Differences from PMD

Covers **AvoidStatefulDatabaseResult**; batch-specific naming variants are aliased in the converter.

## Options

This rule has no configuration options.

## Report messages

| Message ID         | Text                                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `statefulDbResult` | Field '{{name}}' of type '{{type}}' in Database.Stateful class '{{class}}' is not serializable and will cause runtime exceptions. |

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
rules: { 'apex/error-no-stateful-db-result': 'off' }
```
