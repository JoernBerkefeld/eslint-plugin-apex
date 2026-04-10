# `apex/best-test-has-run-as`

> Test classes should include at least one System.runAs() call

|                           |                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                                        |
| **recommended**           | `warn`                                                                                                              |
| **strict**                | `error`                                                                                                             |
| **security** (profile)    | —                                                                                                                   |
| **performance** (profile) | —                                                                                                                   |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexunittestclassshouldhaverunas) |

## Why

Test classes should include at least one System.runAs() call

## PMD relationship

Closest PMD rule name(s): **ApexUnitTestClassShouldHaveRunAs**

## Options

This rule has no configuration options.

## Report messages

| Message ID     | Text                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| `missingRunAs` | Test class '{{name}}' does not contain any System.runAs() calls. Ensure tests are user-context independent. |

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
rules: { 'apex/best-test-has-run-as': 'off' }
```
