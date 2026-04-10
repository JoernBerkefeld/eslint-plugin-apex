# `apex/best-test-assertions-have-message`

> System.assert() calls should include a message parameter for clarity

|                           |                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                                           |
| **recommended**           | `warn`                                                                                                                 |
| **strict**                | `error`                                                                                                                |
| **security** (profile)    | —                                                                                                                      |
| **performance** (profile) | —                                                                                                                      |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexassertionsshouldinc ludemessage) |

## Why

System.assert() calls should include a message parameter for clarity

## PMD relationship

Closest PMD rule name(s): **ApexAssertionsShouldIncludeMessage**

## Options

This rule has no configuration options.

## Report messages

| Message ID       | Text                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| `missingMessage` | {{method}}() should include a message parameter. Example: {{method}}(condition, 'Expected X but got Y'). |

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
rules: { 'apex/best-test-assertions-have-message': 'off' }
```
