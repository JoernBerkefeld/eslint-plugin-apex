# `apex/best-test-has-asserts`

> Apex unit test classes should include at least one assertion

|                           |                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                                          |
| **recommended**           | `warn`                                                                                                                |
| **strict**                | `error`                                                                                                               |
| **security** (profile)    | —                                                                                                                     |
| **performance** (profile) | —                                                                                                                     |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexunittestclassshouldhaveasserts) |

## Why

Apex unit test classes should include at least one assertion

## PMD relationship

Closest PMD rule name(s): **ApexUnitTestClassShouldHaveAsserts**

## Options

JSON Schema (see rule source `meta.schema`):

```json
[
  {
    "type": "object",
    "properties": {
      "additionalAssertMethodPattern": {
        "type": "string"
      }
    },
    "additionalProperties": false
  }
]
```

## Report messages

| Message ID      | Text                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| `missingAssert` | Test method '{{name}}' does not contain any System.assert() calls. Add assertions to verify expected behavior. |

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
rules: { 'apex/best-test-has-asserts': 'off' }
```
