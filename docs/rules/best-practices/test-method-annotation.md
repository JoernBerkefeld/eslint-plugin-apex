# `apex/best-test-method-annotation`

> Use @IsTest annotation instead of the deprecated 'testMethod' keyword

|                           |                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                                                    |
| **recommended**           | `warn`                                                                                                                          |
| **strict**                | `error`                                                                                                                         |
| **security** (profile)    | —                                                                                                                               |
| **performance** (profile) | —                                                                                                                               |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexunittestmethodshouldhaveistestannotation) |

## Why

Use @IsTest annotation instead of the deprecated 'testMethod' keyword

## PMD relationship

Closest PMD rule name(s): **ApexUnitTestMethodShouldHaveIsTestAnnotation**

## Options

This rule has no configuration options.

## Report messages

| Message ID      | Text                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------- |
| `useAnnotation` | Method '{{name}}' uses the deprecated 'testMethod' modifier. Replace with @IsTest annotation. |

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
rules: { 'apex/best-test-method-annotation': 'off' }
```
