# `apex/security-no-xss-false-escape`

> Disabling HTML escaping (escape=false) can introduce XSS vulnerabilities

|                           |                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                             |
| **recommended**           | `error`                                                                                               |
| **strict**                | `error`                                                                                               |
| **security** (profile)    | `error`                                                                                               |
| **performance** (profile) | —                                                                                                     |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexxssfromescape false) |

## Why

Disabling HTML escaping (escape=false) can introduce XSS vulnerabilities

## PMD relationship

Closest PMD rule name(s): **ApexXSSFromEscapeFalse**

## Options

This rule has no configuration options.

## Report messages

| Message ID       | Text                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `xssFalseEscape` | Setting escape to false can introduce XSS vulnerabilities. Use the default HTML-escaped output. |

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
rules: { 'apex/security-no-xss-false-escape': 'off' }
```
