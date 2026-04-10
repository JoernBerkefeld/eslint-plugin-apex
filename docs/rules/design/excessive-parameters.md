# `apex/design-excessive-parameters`

> Flag methods with too many parameters

|                           |                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                       |
| **recommended**           | `warn`                                                                                             |
| **strict**                | `error`                                                                                            |
| **security** (profile)    | —                                                                                                  |
| **performance** (profile) | —                                                                                                  |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#excessiveparameterlist) |

## Why

Flag methods with too many parameters

## PMD relationship

Closest PMD rule name(s): **ExcessiveParameterList**

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "minimum": {
        "type": "number",
        "default": 4
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID      | Text                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `tooManyParams` | Method '{{name}}' has {{count}} parameters (threshold: {{threshold}}). Consider using a parameter object. |

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
rules: { 'apex/design-excessive-parameters': 'off' }
```
