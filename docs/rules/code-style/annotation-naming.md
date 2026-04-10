# `apex/style-annotation-naming`

> Annotation names should use PascalCase

|                           |                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                                |
| **recommended**           | `warn`                                                                                                      |
| **strict**                | `error`                                                                                                     |
| **security** (profile)    | —                                                                                                           |
| **performance** (profile) | —                                                                                                           |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#annotationsnamingconventions) |

## Why

Annotation names should use PascalCase

## PMD relationship

Closest PMD rule name(s): **AnnotationsNamingConventions**

## Options

This rule has no configuration options.

## Report messages

| Message ID    | Text                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| `wrongCasing` | Annotation '@{{name}}' does not use PascalCase. Use '@{{expected}}' instead. |

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
rules: { 'apex/style-annotation-naming': 'off' }
```
