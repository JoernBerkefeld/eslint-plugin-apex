# `apex/design-no-boolean-parameters`

> Avoid boolean parameters in public and global methods

|                           |                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                             |
| **recommended**           | `warn`                                                                                                   |
| **strict**                | `error`                                                                                                  |
| **security** (profile)    | —                                                                                                        |
| **performance** (profile) | —                                                                                                        |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#avoidbooleanmethodparameters) |

## Why

Avoid boolean parameters in public and global methods

## PMD relationship

Closest PMD rule name(s): **AvoidBooleanMethodParameters**

### Differences from PMD

PMD uses **AvoidBooleanMethodParameters**; **AvoidBooleanParameters** is an alias.

## Options

This rule has no configuration options.

## Report messages

| Message ID     | Text                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `booleanParam` | Method '{{method}}' has a boolean parameter '{{param}}'. Consider using an enum or separate methods instead. |

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
rules: { 'apex/design-no-boolean-parameters': 'off' }
```
