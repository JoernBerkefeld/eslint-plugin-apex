# eslint-plugin-apex

ESLint plugin for [Salesforce Apex](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/) — inspired by [apex-pmd](https://github.com/pmd/pmd/tree/main/pmd-apex), this plugin ports **65 active PMD Apex rules** into the ESLint ecosystem so that teams working with Salesforce can use a **single linting tool for both Apex and Lightning Web Components (LWC)** side by side.

If you already use [eslint-plugin-lwc](https://github.com/salesforce/eslint-plugin-lwc) for your LWC code, adding `eslint-plugin-apex` brings your Apex codebase into the same workflow — one `eslint.config.js`, one `npm run lint` command, one CI step.

The plugin is backed by the ANTLR4-based [`@apexdevtools/apex-parser`](https://github.com/apex-dev-tools/apex-parser) for accurate, whitespace-aware parsing rather than regex heuristics.

> **Status:** Early release. Parser coverage is solid for classes and triggers; advanced patterns (anonymous Apex, complex generics) are progressively improved.

## Features

- 65 rules across 7 categories (Best Practices, Code Style, Design, Documentation, Error Prone, Performance, Security)
- Custom ANTLR4-backed parser — no regex heuristics
- ESLint flat config API (v9+)
- Four ready-made shared configs: `recommended`, `strict`, `security`, `performance`
- [PMD converter](https://joernberkefeld.github.io/eslint-plugin-apex/) — paste a PMD XML rule file and get an ESLint config snippet in the browser

## Installation

```bash
npm install --save-dev eslint-plugin-apex
```

Requires **ESLint v9+** and **Node.js v18+**.

## Quick Start

```js
// eslint.config.js
import apex from 'eslint-plugin-apex';

export default [
  apex.configs.recommended,
];
```

## Available Configs

| Config | Severity | Description |
|---|---|---|
| `apex.configs.recommended` | errors for `problem` rules, warnings for `suggestion` | Recommended set of rules |
| `apex.configs.strict` | `error` for all | Every rule enabled as an error |
| `apex.configs.security` | `error` | Security rules only |
| `apex.configs.performance` | `error` | Performance rules only |

All configs automatically target `**/*.cls`, `**/*.trigger`, and `**/*.apex` files.

## Manual Rule Configuration

```js
// eslint.config.js
import apex from 'eslint-plugin-apex';

export default [
  {
    files: ['**/*.cls', '**/*.trigger', '**/*.apex'],
    plugins: { apex },
    languageOptions: apex.configs.recommended.languageOptions,
    rules: {
      'apex/security-no-soql-injection': 'error',
      'apex/perf-no-dml-in-loop':        'error',
      'apex/best-test-has-asserts':      'warn',
      // disable a rule
      'apex/doc-require-apexdoc':        'off',
    },
  },
];
```

## Rule Reference

### Best Practices

| Rule | PMD equivalent | Default |
|---|---|---|
| `apex/best-test-has-asserts` | `ApexUnitTestClassShouldHaveAsserts` | error |
| `apex/best-test-no-see-all-data` | `ApexUnitTestShouldNotUseSeeAllDataTrue` | error |
| `apex/best-test-has-run-as` | `ApexUnitTestClassShouldHaveRunAs` | off |
| `apex/best-test-method-annotation` | `ApexUnitTestMethodShouldHaveIsTestAnnotation` | warn |
| `apex/best-no-global-modifier` | `AvoidGlobalModifier` | warn |
| `apex/best-no-logic-in-trigger` | `AvoidLogicInTrigger` | warn |
| `apex/best-debug-use-logging-level` | `DebugsShouldUseLoggingLevel` | warn |
| `apex/best-no-future-annotation` | `AvoidFutureAnnotation` | warn |
| `apex/best-queueable-needs-finalizer` | `QueueableShouldAttachFinalizer` | off |
| `apex/best-no-unused-local-variable` | `UnusedLocalVariable` | off |
| `apex/best-test-assertions-have-message` | `ApexAssertionsShouldIncludeMessage` | off |

### Code Style

| Rule | PMD equivalent | Default |
|---|---|---|
| `apex/style-naming-conventions` | `FieldNamingConventions` / `MethodNamingConventions` / `ClassNamingConventions` | warn |
| `apex/style-braces-for-if` | `IfStmtsMustUseBraces` | warn |
| `apex/style-braces-for-for` | `ForLoopsMustUseBraces` | warn |
| `apex/style-braces-for-while` | `WhileLoopsMustUseBraces` | warn |
| `apex/style-fields-at-start` | `FieldDeclarationsShouldBeAtStart` | off |
| `apex/style-one-declaration-per-line` | `OneDeclarationPerLine` | off |
| `apex/style-annotation-naming` | `AnnotationNamingConventions` | off |

### Design

| Rule | PMD equivalent | Default |
|---|---|---|
| `apex/design-cyclomatic-complexity` | `CyclomaticComplexity` | warn |
| `apex/design-cognitive-complexity` | `CognitiveComplexity` | off |
| `apex/design-no-deep-nesting` | `TooDeepNesting` | warn |
| `apex/design-excessive-parameters` | `ExcessiveParameterList` | warn |
| `apex/design-excessive-public-count` | `ExcessivePublicCount` | off |
| `apex/design-too-many-fields` | `TooManyFields` | off |
| `apex/design-no-boolean-parameters` | `AvoidBooleanParameters` | off |
| `apex/design-ncss-method-count` | `NcssMethodCount` | off |
| `apex/design-no-unused-method` | `UnusedMethod` | off |

### Documentation

| Rule | PMD equivalent | Default |
|---|---|---|
| `apex/doc-require-apexdoc` | `ApexDoc` | off |

### Error Prone

| Rule | PMD equivalent | Default |
|---|---|---|
| `apex/error-no-empty-catch` | `EmptyCatchBlock` | error |
| `apex/error-no-empty-if` | `EmptyIfStmt` | error |
| `apex/error-no-empty-while` | `EmptyWhileStmt` | error |
| `apex/error-no-empty-try` | `EmptyTryOrFinallyBlock` | error |
| `apex/error-no-csrf-in-constructor` | `ApexCSRF` | error |
| `apex/error-no-hardcoded-id` | `AvoidHardcodedId` | error |
| `apex/error-no-direct-trigger-map-access` | `AvoidDirectTriggerMapAccess` | error |
| `apex/error-no-nonexistent-annotation` | `NonExistentCustomSettingOrMetadata` | error |
| `apex/error-no-stateful-db-result` | `AvoidStatefulDbResultInBatch` | off |
| `apex/error-aura-enabled-getter-public` | `AuraEnabledWithoutCatchBlock` | error |
| `apex/error-no-method-name-as-class` | `MethodWithSameNameAsEnclosingClass` | error |
| `apex/error-override-both-equals-hashcode` | `OverrideBothEqualsAndHashcode` | warn |
| `apex/error-test-methods-in-test-class` | `TestMethodsMustBeInTestClasses` | warn |
| `apex/error-no-type-shadow-namespace` | `AvoidShadowingField` | off |

### Performance

| Rule | PMD equivalent | Default |
|---|---|---|
| `apex/perf-no-dml-in-loop` | `AvoidDmlStatementsInLoops` | error |
| `apex/perf-no-debug-statements` | `AvoidDebugStatements` | off |
| `apex/perf-no-non-restrictive-query` | `WherelessSOQLQuery` | error |
| `apex/perf-no-eager-describe` | `AvoidLazyDescribeSetting` | off |
| `apex/perf-no-high-cost-in-loop` | `AvoidSoqlInLoops` | error |

### Security

| Rule | PMD equivalent | Default |
|---|---|---|
| `apex/security-no-hardcoded-crypto` | `ApexBadCrypto` | error |
| `apex/security-crud-violation` | `ApexCRUDViolation` | error |
| `apex/security-no-dangerous-methods` | `ApexDangerousMethods` | error |
| `apex/security-no-insecure-endpoint` | `ApexInsecureEndpoint` | error |
| `apex/security-no-open-redirect` | `ApexOpenRedirect` | error |
| `apex/security-sharing-violations` | `ApexSharingViolations` | error |
| `apex/security-no-soql-injection` | `ApexSOQLInjection` | error |
| `apex/security-use-named-credentials` | `ApexSuggestUsingNamedCredential` | warn |
| `apex/security-no-xss-false-escape` | `ApexXSSFromEscapeFalse` | error |
| `apex/security-no-xss-from-url` | `ApexXSSFromURLParam` | error |

## PMD Converter

The [PMD Converter](https://joernberkefeld.github.io/eslint-plugin-apex/) is a browser-based tool that converts PMD Apex XML rule files into:

1. An ESLint flat-config snippet with the correct rule IDs and severities
2. A rule implementation skeleton (when the PMD rule is not yet in this plugin)

No data is sent anywhere — conversion happens entirely in the browser.

## Architecture

```
eslint-plugin-apex/
├── src/
│   ├── node-types.js       ← custom AST node type constants + VISITOR_KEYS
│   ├── ast-builder.js      ← ANTLR4 parse tree → custom ESLint AST
│   ├── apex-parser.js      ← parseForESLint() adapter
│   ├── index.js            ← plugin entry point, rule registry, shared configs
│   └── rules/
│       ├── best-practices/ ← 11 rules
│       ├── code-style/     ← 7 rules
│       ├── design/         ← 9 rules
│       ├── documentation/  ← 1 rule
│       ├── error-prone/    ← 14 rules
│       ├── performance/    ← 5 rules
│       └── security/       ← 10 rules
├── tests/
│   ├── parser.test.js      ← custom parser tests (node:test)
│   └── rules.test.js       ← RuleTester tests for all rules
└── docs/
    └── index.html          ← GitHub Pages PMD converter
```

The parser uses [`@apexdevtools/apex-parser`](https://github.com/apex-dev-tools/apex-parser), an ANTLR4-based Apex parser, and wraps its concrete syntax tree into a flat, traversable AST with custom node types.

## Contributing

Contributions welcome — especially:
- Improved AST coverage for edge-case Apex constructs
- More comprehensive rule implementations
- Additional test cases

## License

MIT — see [LICENSE](./LICENSE).
