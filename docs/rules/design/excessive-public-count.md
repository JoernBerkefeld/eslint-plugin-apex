# `apex/design-excessive-public-count`

> Flag classes with too many public methods or attributes

|                           |                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| **Type**                  | `suggestion`                                                                                     |
| **recommended**           | `warn`                                                                                           |
| **strict**                | `error`                                                                                          |
| **security** (profile)    | —                                                                                                |
| **performance** (profile) | —                                                                                                |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#excessivepubliccount) |

## Why

Flag classes with too many public methods or attributes

## PMD relationship

Closest PMD rule name(s): **ExcessivePublicCount**

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "minimum": {
        "type": "number",
        "default": 20
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID      | Text                                                                                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `tooManyPublic` | Class '{{name}}' has {{count}} public members (threshold: {{threshold}}). Consider splitting into smaller, focused classes. |

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
rules: { 'apex/design-excessive-public-count': 'off' }
```
