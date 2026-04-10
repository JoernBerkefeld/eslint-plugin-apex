# `apex/best-no-logic-in-trigger`

> Avoid placing business logic directly in triggers — delegate to handler classes

|                           |                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Type**                  | `suggestion`                                                                                           |
| **recommended**           | `warn`                                                                                                 |
| **strict**                | `error`                                                                                                |
| **security** (profile)    | —                                                                                                      |
| **performance** (profile) | —                                                                                                      |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#avoidlogicintrigger) |

## Why

Avoid placing business logic directly in triggers — delegate to handler classes

## PMD relationship

Closest PMD rule name(s): **AvoidLogicInTrigger**

## Options

This rule has no configuration options.

## Report messages

| Message ID       | Text                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `logicInTrigger` | Trigger '{{name}}' contains business logic. Move it to a dedicated handler class for testability and reusability. |

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
rules: { 'apex/best-no-logic-in-trigger': 'off' }
```
