# `apex/design-ncss-method-count`

> Limit the number of non-commenting source statements per method and class

|                           |                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                          |
| **recommended**           | `warn`                                                                                |
| **strict**                | `error`                                                                               |
| **security** (profile)    | —                                                                                     |
| **performance** (profile) | —                                                                                     |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#ncsscount) |

## Why

Limit the number of non-commenting source statements per method and class

## PMD relationship

Closest PMD rule name(s): **NcssMethodCount, NcssCount, NcssTypeCount**

### Differences from PMD

One implementation aggregates **NcssMethodCount**, **NcssCount**, and **NcssTypeCount** style thresholds from the rule options.

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "methodReportLevel": {
        "type": "number",
        "default": 40
      },
      "classReportLevel": {
        "type": "number",
        "default": 500
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID      | Text                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `tooLongMethod` | Method '{{name}}' has {{count}} NCSS statements (threshold: {{threshold}}). Consider breaking it into smaller methods. |
| `tooLongClass`  | Class '{{name}}' has {{count}} NCSS statements (threshold: {{threshold}}). Consider splitting it.                      |

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
rules: { 'apex/design-ncss-method-count': 'off' }
```
