# `apex/best-test-no-see-all-data`

> Avoid @isTest(seeAllData=true) as it exposes real org data to test modifications

|                           |                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                                             |
| **recommended**           | `error`                                                                                                               |
| **strict**                | `error`                                                                                                               |
| **security** (profile)    | —                                                                                                                     |
| **performance** (profile) | —                                                                                                                     |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexunittestshouldusenotseealldata) |

## Why

Avoid @isTest(seeAllData=true) as it exposes real org data to test modifications

## PMD relationship

Closest PMD rule name(s): **ApexUnitTestShouldNotUseSeeAllDataTrue**

## Options

This rule has no configuration options.

## Report messages

| Message ID   | Text                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| `seeAllData` | @isTest(seeAllData=true) is set on '{{name}}'. Remove it or set seeAllData=false to isolate tests from org data. |

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
rules: { 'apex/best-test-no-see-all-data': 'off' }
```
