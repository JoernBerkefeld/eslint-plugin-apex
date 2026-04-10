# `apex/error-no-method-name-as-class`

> Non-constructor methods should not share the name of the enclosing class

|                           |                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Type**                  | `problem`                                                                                                          |
| **recommended**           | `error`                                                                                                            |
| **strict**                | `error`                                                                                                            |
| **security** (profile)    | —                                                                                                                  |
| **performance** (profile) | —                                                                                                                  |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#methodwithsamenameasenclosingclass) |

## Why

Non-constructor methods should not share the name of the enclosing class

## PMD relationship

Closest PMD rule name(s): **MethodWithSameNameAsEnclosingClass**

## Options

This rule has no configuration options.

## Report messages

| Message ID          | Text                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `methodNameAsClass` | Method '{{method}}' has the same name as its enclosing class '{{class}}'. If this is a constructor, remove the return type. If it is a method, rename it. |

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
rules: { 'apex/error-no-method-name-as-class': 'off' }
```
