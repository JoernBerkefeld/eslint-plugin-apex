# `apex/security-no-soql-injection`

> Avoid SOQL injection — use bind variables or String.escapeSingleQuotes()

|                           |                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                       |
| **recommended**           | `error`                                                                                         |
| **strict**                | `error`                                                                                         |
| **security** (profile)    | `error`                                                                                         |
| **performance** (profile) | —                                                                                               |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexsoqlinjection) |

## Why

Avoid SOQL injection — use bind variables or String.escapeSingleQuotes()

## PMD relationship

Closest PMD rule name(s): **ApexSOQLInjection**

## Options

This rule has no configuration options.

## Report messages

| Message ID      | Text                                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `soqlInjection` | Dynamic SOQL query built via string concatenation may be vulnerable to SOQL injection. Use bind variables (:variable) or String.escapeSingleQuotes(). |

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
rules: { 'apex/security-no-soql-injection': 'off' }
```
