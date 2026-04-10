# `apex/error-no-type-shadow-namespace`

> Avoid declaring types with the same name as System or Schema namespace types

|                           |                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                                   |
| **recommended**           | `error`                                                                                                     |
| **strict**                | `error`                                                                                                     |
| **security** (profile)    | —                                                                                                           |
| **performance** (profile) | —                                                                                                           |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#typeshadowsbuiltinnamespace) |

## Why

Avoid declaring types with the same name as System or Schema namespace types

## PMD relationship

Closest PMD rule name(s): **TypeShadowsBuiltInNamespace**

### Differences from PMD

Implements **TypeShadowsBuiltInNamespace**; **AvoidShadowingField** is a related legacy alias in the converter.

## Options

This rule has no configuration options.

## Report messages

| Message ID       | Text                                                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `shadowsBuiltIn` | '{{kind}}' '{{name}}' shadows a built-in Apex type in the System or Schema namespace. Choose a different name to avoid ambiguity. |

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
rules: { 'apex/error-no-type-shadow-namespace': 'off' }
```
