# `apex/design-cognitive-complexity`

> Limit cognitive complexity of methods and classes

|                           |                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                    |
| **recommended**           | `warn`                                                                                          |
| **strict**                | `error`                                                                                         |
| **security** (profile)    | —                                                                                               |
| **performance** (profile) | —                                                                                               |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#cognitivecomplexity) |

## Why

Limit cognitive complexity of methods and classes

## PMD relationship

Closest PMD rule name(s): **CognitiveComplexity**

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "methodThreshold": {
        "type": "number",
        "default": 15
      },
      "classThreshold": {
        "type": "number",
        "default": 50
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID         | Text                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `tooComplexMethod` | Method '{{name}}' has a cognitive complexity of {{complexity}} (threshold: {{threshold}}). Simplify by reducing nesting or extracting logic. |
| `tooComplexClass`  | Class '{{name}}' has a total cognitive complexity of {{complexity}} (threshold: {{threshold}}).                                              |

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
rules: { 'apex/design-cognitive-complexity': 'off' }
```
