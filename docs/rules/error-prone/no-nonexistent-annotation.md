# `apex/error-no-nonexistent-annotation`

> Avoid annotations that do not exist in Apex

|                           |                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                                   |
| **recommended**           | `error`                                                                                                     |
| **strict**                | `error`                                                                                                     |
| **security** (profile)    | —                                                                                                           |
| **performance** (profile) | —                                                                                                           |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#avoidnonexistentannotations) |

## Why

Avoid annotations that do not exist in Apex

## PMD relationship

Closest PMD rule name(s): **AvoidNonExistentAnnotations**

### Differences from PMD

Covers **AvoidNonExistentAnnotations**; **NonExistentCustomSettingOrMetadata** is a legacy alias.

## Options

This rule has no configuration options.

## Report messages

| Message ID          | Text                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `unknownAnnotation` | '@{{name}}' is not a recognized Apex annotation and may cause errors in future API versions. |

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
rules: { 'apex/error-no-nonexistent-annotation': 'off' }
```
