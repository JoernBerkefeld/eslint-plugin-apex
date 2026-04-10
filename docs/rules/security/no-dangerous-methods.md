# `apex/security-no-dangerous-methods`

> Flag potentially dangerous Apex method calls

|                           |                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                       |
| **recommended**           | `warn`                                                                                             |
| **strict**                | `error`                                                                                            |
| **security** (profile)    | `error`                                                                                            |
| **performance** (profile) | —                                                                                                  |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexdangerousmethods) |

## Why

Flag potentially dangerous Apex method calls

## PMD relationship

Closest PMD rule name(s): **ApexDangerousMethods**

## Options

This rule has no configuration options.

## Report messages

| Message ID        | Text                             |
| ----------------- | -------------------------------- |
| `dangerousMethod` | Call to '{{callee}}': {{reason}} |

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
rules: { 'apex/security-no-dangerous-methods': 'off' }
```
