# `apex/best-no-future-annotation`

> Prefer Queueable over @Future — the future annotation has significant limitations

|                           |                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                             |
| **recommended**           | `off`                                                                                                    |
| **strict**                | `error`                                                                                                  |
| **security** (profile)    | —                                                                                                        |
| **performance** (profile) | —                                                                                                        |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#avoidfutureannotation) |

## Why

Prefer Queueable over @Future — the future annotation has significant limitations

## PMD relationship

Closest PMD rule name(s): **AvoidFutureAnnotation**

## Options

This rule has no configuration options.

## Report messages

| Message ID  | Text                                                                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useFuture` | Method '{{name}}' uses @Future. Consider implementing the Queueable interface instead for better monitoring, chaining, and complex argument support. |

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
rules: { 'apex/best-no-future-annotation': 'off' }
```
