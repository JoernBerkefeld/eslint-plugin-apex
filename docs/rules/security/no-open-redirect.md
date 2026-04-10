# `apex/security-no-open-redirect`

> Avoid constructing PageReference from user-controlled input

|                           |                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                      |
| **recommended**           | `error`                                                                                        |
| **strict**                | `error`                                                                                        |
| **security** (profile)    | `error`                                                                                        |
| **performance** (profile) | —                                                                                              |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexopenredirect) |

## Why

Avoid constructing PageReference from user-controlled input

## PMD relationship

Closest PMD rule name(s): **ApexOpenRedirect**

## Options

This rule has no configuration options.

## Report messages

| Message ID     | Text                                                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `openRedirect` | PageReference constructed from a non-literal value may be user-controlled. Validate redirect targets to prevent open redirect vulnerabilities. |

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
rules: { 'apex/security-no-open-redirect': 'off' }
```
