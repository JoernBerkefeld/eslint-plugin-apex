# `apex/error-aura-enabled-getter-public`

> @AuraEnabled property getters must be public or global

|                           |                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                                     |
| **recommended**           | `error`                                                                                                       |
| **strict**                | `error`                                                                                                       |
| **security** (profile)    | —                                                                                                             |
| **performance** (profile) | —                                                                                                             |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#inaccessibleauraenabledgetter) |

## Why

@AuraEnabled property getters must be public or global

## PMD relationship

Closest PMD rule name(s): **InaccessibleAuraEnabledGetter**

## Options

This rule has no configuration options.

## Report messages

| Message ID           | Text                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `inaccessibleGetter` | Property '{{name}}' has @AuraEnabled but its getter is not public or global. It will be inaccessible from Lightning components. |

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
rules: { 'apex/error-aura-enabled-getter-public': 'off' }
```
