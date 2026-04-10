# `apex/security-crud-violation`

> DML operations and SOQL queries should include CRUD/FLS permission checks

|                           |                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| **Type**                  | `suggestion`                                                                                    |
| **recommended**           | `warn`                                                                                          |
| **strict**                | `error`                                                                                         |
| **security** (profile)    | `error`                                                                                         |
| **performance** (profile) | —                                                                                               |
| **PMD docs**              | [pmd-code.org](https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexcrudviolation) |

## Why

DML operations and SOQL queries should include CRUD/FLS permission checks

## PMD relationship

Closest PMD rule name(s): **ApexCRUDViolation**

## Options

This rule has no configuration options.

## Report messages

| Message ID    | Text                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `missingCrud` | {{operation}} operation should be preceded by a CRUD/FLS permission check (e.g., Schema.sObjectType.Account.isCreateable()). |

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
rules: { 'apex/security-crud-violation': 'off' }
```
