# `apex/style-naming-conventions`

> Enforce configurable naming conventions for Apex declarations

|                           |                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Type**                  | `suggestion`                                                                                           |
| **recommended**           | `warn`                                                                                                 |
| **strict**                | `error`                                                                                                |
| **security** (profile)    | —                                                                                                      |
| **performance** (profile) | —                                                                                                      |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#classnaming conventions) |

## Why

Enforce configurable naming conventions for Apex declarations

## PMD relationship

Closest PMD rule name(s): **ClassNamingConventions, MethodNamingConventions, FieldNamingConventions, LocalVariableNamingConventions, FormalParameterNamingConventions, PropertyNamingConventions**

### Differences from PMD

Covers class, method, field, local, parameter, and property naming PMD rules via options.

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "classPattern": {
        "type": "string",
        "default": "PascalCase"
      },
      "testClassPattern": {
        "type": "string",
        "default": "PascalCase"
      },
      "interfacePattern": {
        "type": "string",
        "default": "PascalCase"
      },
      "enumPattern": {
        "type": "string",
        "default": "PascalCase"
      },
      "methodPattern": {
        "type": "string",
        "default": "camelCase"
      },
      "fieldPattern": {
        "type": "string",
        "default": "camelCase"
      },
      "staticFieldPattern": {
        "type": "string",
        "default": "camelCase"
      },
      "constantPattern": {
        "type": "string",
        "default": "UPPER_SNAKE_CASE"
      },
      "localPattern": {
        "type": "string",
        "default": "camelCase"
      },
      "paramPattern": {
        "type": "string",
        "default": "camelCase"
      },
      "propertyPattern": {
        "type": "string",
        "default": "camelCase"
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID    | Text                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------- |
| `invalidName` | '{{name}}' does not match the expected naming convention for {{kind}} (expected: {{pattern}}). |

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
rules: { 'apex/style-naming-conventions': 'off' }
```
