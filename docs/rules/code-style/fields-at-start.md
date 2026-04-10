# `apex/style-fields-at-start`

> Field declarations should appear before method declarations

|                           |                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                                     |
| **recommended**           | `warn`                                                                                                           |
| **strict**                | `error`                                                                                                          |
| **security** (profile)    | —                                                                                                                |
| **performance** (profile) | —                                                                                                                |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#fielddeclarationsshouldbeat start) |

## Why

Field declarations should appear before method declarations

## PMD relationship

Closest PMD rule name(s): **FieldDeclarationsShouldBeAtStart**

## Options

This rule has no configuration options.

## Report messages

| Message ID         | Text                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `fieldAfterMethod` | Field '{{name}}' is declared after a method. Move field declarations to the top of the class body. |

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
rules: { 'apex/style-fields-at-start': 'off' }
```
