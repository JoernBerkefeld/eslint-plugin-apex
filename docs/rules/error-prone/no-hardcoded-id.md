# `apex/error-no-hardcoded-id`

> Avoid hardcoding Salesforce record IDs — they differ between environments

|                           |                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| **Type**                  | `problem`                                                                                         |
| **recommended**           | `error`                                                                                           |
| **strict**                | `error`                                                                                           |
| **security** (profile)    | —                                                                                                 |
| **performance** (profile) | —                                                                                                 |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#avoidhardcodingid) |

## Why

Avoid hardcoding Salesforce record IDs — they differ between environments

## PMD relationship

Closest PMD rule name(s): **AvoidHardcodingId**

### Differences from PMD

PMD documents **AvoidHardcodingId**; older spellings may appear in exports.

## Options

This rule has no configuration options.

## Report messages

| Message ID    | Text                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `hardcodedId` | Hardcoded Salesforce ID '{{value}}' detected. IDs are environment-specific. Use Custom Settings, Custom Labels, or dynamic SOQL instead. |

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
rules: { 'apex/error-no-hardcoded-id': 'off' }
```
