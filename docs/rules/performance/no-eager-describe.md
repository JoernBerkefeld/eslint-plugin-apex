# `apex/perf-no-eager-describe`

> Avoid calling Schema.describe\*() methods inside loops — cache results instead

|                           |                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                            |
| **recommended**           | `error`                                                                                              |
| **strict**                | `error`                                                                                              |
| **security** (profile)    | —                                                                                                    |
| **performance** (profile) | `error`                                                                                              |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html#avoideagerdescribes) |

## Why

Avoid calling Schema.describe\*() methods inside loops — cache results instead

## PMD relationship

Closest PMD rule name(s): **AvoidEagerDescribes**

### Differences from PMD

This rule matches **AvoidEagerDescribes** behaviour: describe-style calls inside loops. It does **not** implement **EagerlyLoadedDescribeSObjectResult** (passing `SObjectDescribeOptions` to avoid eager child-relationship loading). Those are separate concerns.

## Options

This rule has no configuration options.

## Report messages

| Message ID      | Text                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| `eagerDescribe` | Call to '{{callee}}' inside a loop is expensive. Cache the describe result in a class-level variable. |

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
rules: { 'apex/perf-no-eager-describe': 'off' }
```
