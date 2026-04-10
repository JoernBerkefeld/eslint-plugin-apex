# `apex/best-debug-use-logging-level`

> System.debug() calls should specify a LoggingLevel argument

|                           |                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                                   |
| **recommended**           | `warn`                                                                                                         |
| **strict**                | `error`                                                                                                        |
| **security** (profile)    | —                                                                                                              |
| **performance** (profile) | —                                                                                                              |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#debugsshoulduselogginglevel) |

## Why

System.debug() calls should specify a LoggingLevel argument

## PMD relationship

Closest PMD rule name(s): **DebugsShouldUseLoggingLevel**

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "strictMode": {
        "type": "boolean",
        "default": false
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID     | Text                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `missingLevel` | System.debug() is called without a LoggingLevel argument. Specify LoggingLevel.INFO, LoggingLevel.WARN, etc. |
| `debugLevel`   | System.debug() is called with LoggingLevel.DEBUG. Use a more specific level like LoggingLevel.INFO.          |

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
rules: { 'apex/best-debug-use-logging-level': 'off' }
```
