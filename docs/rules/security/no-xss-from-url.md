# `apex/security-no-xss-from-url`

> URL parameter values must be sanitized before output to prevent XSS

|                           |                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                         |
| **recommended**           | `error`                                                                                           |
| **strict**                | `error`                                                                                           |
| **security** (profile)    | `error`                                                                                           |
| **performance** (profile) | —                                                                                                 |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexxssfromurlparam) |

## Why

URL parameter values must be sanitized before output to prevent XSS

## PMD relationship

Closest PMD rule name(s): **ApexXSSFromURLParam**

## Options

This rule has no configuration options.

## Report messages

| Message ID   | Text                                                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `xssFromUrl` | URL parameter value accessed without sanitization. Wrap with HTMLENCODE(), JSENCODE(), or String.escapeSingleQuotes() before using in output. |

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
rules: { 'apex/security-no-xss-from-url': 'off' }
```
