# `apex/security-sharing-violations`

> Classes that access data should explicitly declare 'with sharing' or 'without sharing'

|                           |                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                        |
| **recommended**           | `warn`                                                                                              |
| **strict**                | `error`                                                                                             |
| **security** (profile)    | `error`                                                                                             |
| **performance** (profile) | —                                                                                                   |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexsharingviolations) |

## Why

Classes that access data should explicitly declare 'with sharing' or 'without sharing'

## PMD relationship

Closest PMD rule name(s): **ApexSharingViolations**

## Options

This rule has no configuration options.

## Report messages

| Message ID      | Text                                                                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `noSharingDecl` | Class '{{name}}' does not declare a sharing model (with sharing, without sharing, or inherited sharing). Add one to make the intent explicit. |

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
rules: { 'apex/security-sharing-violations': 'off' }
```
