# `apex/error-no-csrf-in-constructor`

> Disallow DML operations in constructors or class initializers

|                           |                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                |
| **recommended**           | `error`                                                                                  |
| **strict**                | `error`                                                                                  |
| **security** (profile)    | —                                                                                        |
| **performance** (profile) | —                                                                                        |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#apexcsrf) |

## Why

Disallow DML operations in constructors or class initializers

## PMD relationship

Closest PMD rule name(s): **ApexCSRF**

## Options

This rule has no configuration options.

## Report messages

| Message ID         | Text                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `dmlInConstructor` | Constructor '{{name}}' contains a DML operation. DML in constructors can cause CSRF and runtime exceptions. |

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
rules: { 'apex/error-no-csrf-in-constructor': 'off' }
```
