# `apex/best-queueable-needs-finalizer`

> Queueable classes should attach a Finalizer for error recovery

|                           |                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Type**                  | `suggestion`                                                                                                 |
| **recommended**           | `off`                                                                                                        |
| **strict**                | `error`                                                                                                      |
| **security** (profile)    | —                                                                                                            |
| **performance** (profile) | —                                                                                                            |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#queueablewithoutfinalizer) |

## Why

Queueable classes should attach a Finalizer for error recovery

## PMD relationship

Closest PMD rule name(s): **QueueableWithoutFinalizer**

### Differences from PMD

Maps to **QueueableWithoutFinalizer**; **QueueableShouldAttachFinalizer** is a legacy alias.

## Options

This rule has no configuration options.

## Report messages

| Message ID    | Text                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `noFinalizer` | Class '{{name}}' implements Queueable but does not call System.attachFinalizer(). Add a Finalizer to handle execution failures. |

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
rules: { 'apex/best-queueable-needs-finalizer': 'off' }
```
