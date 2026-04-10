# `apex/security-no-insecure-endpoint`

> HTTP callout endpoints must use HTTPS

|                           |                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                          |
| **recommended**           | `error`                                                                                            |
| **strict**                | `error`                                                                                            |
| **security** (profile)    | `error`                                                                                            |
| **performance** (profile) | —                                                                                                  |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexinsecureendpoint) |

## Why

HTTP callout endpoints must use HTTPS

## PMD relationship

Closest PMD rule name(s): **ApexInsecureEndpoint**

## Options

This rule has no configuration options.

## Report messages

| Message ID         | Text                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `insecureEndpoint` | Endpoint '{{url}}' uses HTTP instead of HTTPS. Unencrypted connections expose data in transit. |

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
rules: { 'apex/security-no-insecure-endpoint': 'off' }
```
