# `apex/error-no-direct-trigger-map-access`

> Avoid direct index access to Trigger.new or Trigger.old — iterate instead

|                           |                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                                   |
| **recommended**           | `error`                                                                                                     |
| **strict**                | `error`                                                                                                     |
| **security** (profile)    | —                                                                                                           |
| **performance** (profile) | —                                                                                                           |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#avoiddirectaccesstriggermap) |

## Why

Avoid direct index access to Trigger.new or Trigger.old — iterate instead

## PMD relationship

Closest PMD rule name(s): **AvoidDirectAccessTriggerMap**

### Differences from PMD

Implements **AvoidDirectAccessTriggerMap** naming from current PMD; older keys may omit “Access”.

## Options

This rule has no configuration options.

## Report messages

| Message ID     | Text                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| `directAccess` | Direct index access to '{{name}}' detected. Use a for-each loop to iterate over the trigger collection. |

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
rules: { 'apex/error-no-direct-trigger-map-access': 'off' }
```
