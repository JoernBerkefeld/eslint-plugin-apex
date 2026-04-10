# `apex/error-test-methods-in-test-class`

> @IsTest methods must reside in @IsTest annotated classes

|                           |                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                                      |
| **recommended**           | `error`                                                                                                        |
| **strict**                | `error`                                                                                                        |
| **security** (profile)    | —                                                                                                              |
| **performance** (profile) | —                                                                                                              |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#testmethodsmustbeintestclasses) |

## Why

@IsTest methods must reside in @IsTest annotated classes

## PMD relationship

Closest PMD rule name(s): **TestMethodsMustBeInTestClasses**

## Options

This rule has no configuration options.

## Report messages

| Message ID                   | Text                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `testMethodOutsideTestClass` | Method '{{name}}' is a test method but class '{{class}}' is not annotated with @IsTest. |

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
rules: { 'apex/error-test-methods-in-test-class': 'off' }
```
