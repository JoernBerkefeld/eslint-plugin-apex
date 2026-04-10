# `apex/design-too-many-fields`

> Flag classes with too many fields

|                           |                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                              |
| **recommended**           | `warn`                                                                                    |
| **strict**                | `error`                                                                                   |
| **security** (profile)    | —                                                                                         |
| **performance** (profile) | —                                                                                         |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#toomanyfields) |

## Why

Flag classes with too many fields

## PMD relationship

Closest PMD rule name(s): **TooManyFields**

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "minimum": {
        "type": "number",
        "default": 15
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID      | Text                                                                                    |
| --------------- | --------------------------------------------------------------------------------------- |
| `tooManyFields` | Class '{{name}}' has {{count}} fields (threshold: {{threshold}}). Consider refactoring. |

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
rules: { 'apex/design-too-many-fields': 'off' }
```
