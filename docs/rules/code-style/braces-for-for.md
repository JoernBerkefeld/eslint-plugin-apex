# `apex/style-braces-for-for`

> Require braces around for loop bodies

|                           |                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                         |
| **recommended**           | `warn`                                                                                               |
| **strict**                | `error`                                                                                              |
| **security** (profile)    | —                                                                                                    |
| **performance** (profile) | —                                                                                                    |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#forloopsmustusebraces) |

## Why

Require braces around for loop bodies

## PMD relationship

Closest PMD rule name(s): **ForLoopsMustUseBraces**

## Options

This rule has no configuration options.

## Report messages

| Message ID      | Text                                             |
| --------------- | ------------------------------------------------ |
| `missingBraces` | For loop body should be wrapped in curly braces. |

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
rules: { 'apex/style-braces-for-for': 'off' }
```
