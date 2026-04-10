# `apex/style-braces-for-if`

> Require braces around if/else statement bodies

|                           |                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                        |
| **recommended**           | `warn`                                                                                              |
| **strict**                | `error`                                                                                             |
| **security** (profile)    | —                                                                                                   |
| **performance** (profile) | —                                                                                                   |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#ifstmtsmustusebraces) |

## Why

Require braces around if/else statement bodies

## PMD relationship

Closest PMD rule name(s): **IfStmtsMustUseBraces, IfElseStmtsMustUseBraces**

### Differences from PMD

**IfElseStmtsMustUseBraces** and **IfStmtsMustUseBraces** both map to this rule.

## Options

This rule has no configuration options.

## Report messages

| Message ID      | Text                                                            |
| --------------- | --------------------------------------------------------------- |
| `missingBraces` | {{kind}} statement body should be wrapped in curly braces '{}'. |

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
rules: { 'apex/style-braces-for-if': 'off' }
```
