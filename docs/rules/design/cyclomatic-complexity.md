# `apex/design-cyclomatic-complexity`

> Limit cyclomatic complexity of methods and classes

|                           |                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| **Type**                  | `suggestion`                                                                                     |
| **recommended**           | `warn`                                                                                           |
| **strict**                | `error`                                                                                          |
| **security** (profile)    | —                                                                                                |
| **performance** (profile) | —                                                                                                |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#cyclomaticcomplexity) |

## Why

Limit cyclomatic complexity of methods and classes

## PMD relationship

Closest PMD rule name(s): **CyclomaticComplexity, StdCyclomaticComplexity**

### Differences from PMD

**StdCyclomaticComplexity** is routed here alongside **CyclomaticComplexity**.

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "methodThreshold": {
        "type": "number",
        "default": 10
      },
      "classThreshold": {
        "type": "number",
        "default": 40
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID         | Text                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `tooComplexMethod` | Method '{{name}}' has a cyclomatic complexity of {{complexity}} (threshold: {{threshold}}). Consider breaking it into smaller methods.       |
| `tooComplexClass`  | Class '{{name}}' has a total cyclomatic complexity of {{complexity}} (threshold: {{threshold}}). Consider refactoring into multiple classes. |

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
rules: { 'apex/design-cyclomatic-complexity': 'off' }
```
