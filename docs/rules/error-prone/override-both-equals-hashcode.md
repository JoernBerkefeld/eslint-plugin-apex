# `apex/error-override-both-equals-hashcode`

> If overriding equals(), also override hashCode(), and vice versa

|                           |                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                                     |
| **recommended**           | `error`                                                                                                       |
| **strict**                | `error`                                                                                                       |
| **security** (profile)    | —                                                                                                             |
| **performance** (profile) | —                                                                                                             |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#overridebothequalsandhashcode) |

## Why

If overriding equals(), also override hashCode(), and vice versa

## PMD relationship

Closest PMD rule name(s): **OverrideBothEqualsAndHashcode**

## Options

This rule has no configuration options.

## Report messages

| Message ID        | Text                                                                               |
| ----------------- | ---------------------------------------------------------------------------------- |
| `missingHashCode` | Class '{{name}}' overrides equals() but not hashCode(). Add a hashCode() override. |
| `missingEquals`   | Class '{{name}}' overrides hashCode() but not equals(). Add an equals() override.  |

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
rules: { 'apex/error-override-both-equals-hashcode': 'off' }
```
