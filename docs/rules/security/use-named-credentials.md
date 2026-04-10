# `apex/security-use-named-credentials`

> Use Named Credentials instead of hardcoding authentication details in HTTP requests

|                           |                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                            |
| **recommended**           | `warn`                                                                                                  |
| **strict**                | `error`                                                                                                 |
| **security** (profile)    | `error`                                                                                                 |
| **performance** (profile) | —                                                                                                       |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexsuggestusingnamedcred) |

## Why

Use Named Credentials instead of hardcoding authentication details in HTTP requests

## PMD relationship

Closest PMD rule name(s): **ApexSuggestUsingNamedCred**

### Differences from PMD

PMD rule id is **ApexSuggestUsingNamedCred** (short form on docs.pmd-code.org).

## Options

This rule has no configuration options.

## Report messages

| Message ID              | Text                                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `useNamedCreds`         | HttpRequest.setHeader() with '{{header}}' may contain hardcoded credentials. Use Named Credentials (callout:NamedCred/...) instead. |
| `useNamedCredsEndpoint` | HttpRequest endpoint '{{url}}' does not use a Named Credential. Prefix callout endpoints with 'callout:' to use Named Credentials.  |

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
rules: { 'apex/security-use-named-credentials': 'off' }
```
