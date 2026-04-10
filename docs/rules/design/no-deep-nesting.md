# `apex/design-no-deep-nesting`

> Avoid deeply nested if statements

|                           |                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                         |
| **recommended**           | `warn`                                                                                               |
| **strict**                | `error`                                                                                              |
| **security** (profile)    | —                                                                                                    |
| **performance** (profile) | —                                                                                                    |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#avoiddeeplynestedifstmts) |

## Why

Avoid deeply nested if statements

## PMD relationship

Closest PMD rule name(s): **AvoidDeeplyNestedIfStmts**

### Differences from PMD

Maps to **AvoidDeeplyNestedIfStmts**; older typo keys like `TooDeepCNesting` are still accepted by the converter.

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "problemDepth": {
        "type": "number",
        "default": 3
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID | Text                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `tooDeep`  | Deeply nested statement found at level {{level}} (threshold: {{threshold}}). Consider extracting logic into a separate method. |

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
rules: { 'apex/design-no-deep-nesting': 'off' }
```
