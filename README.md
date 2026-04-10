# eslint-plugin-apex

ESLint plugin for [Salesforce Apex](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/) — inspired by [apex-pmd](https://github.com/pmd/pmd/tree/main/pmd-apex), this plugin ports **57 ESLint rules** that align with the PMD Apex rule set into the ESLint ecosystem so that teams working with Salesforce can use a **single linting tool for both Apex and Lightning Web Components (LWC)** side by side.

If you already use [eslint-plugin-lwc](https://github.com/salesforce/eslint-plugin-lwc) for your LWC code, adding `eslint-plugin-apex` brings your Apex codebase into the same workflow — one `eslint.config.js`, one `npm run lint` command, one CI step.

The plugin is backed by the ANTLR4-based [`@apexdevtools/apex-parser`](https://github.com/apex-dev-tools/apex-parser) for accurate, whitespace-aware parsing rather than regex heuristics.

> **Status:** Early release. Parser coverage is solid for classes and triggers; advanced patterns (anonymous Apex, complex generics) are progressively improved.

## Features

- **57 rules** across 7 categories (Best Practices, Code Style, Design, Documentation, Error Prone, Performance, Security), each with a Markdown page under `docs/rules/`
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

export default [apex.configs.recommended];
```

## Available Configs

| Config                     | Severity                                              | Description                    |
| -------------------------- | ----------------------------------------------------- | ------------------------------ |
| `apex.configs.recommended` | errors for `problem` rules, warnings for `suggestion` | Recommended set of rules       |
| `apex.configs.strict`      | `error` for all                                       | Every rule enabled as an error |
| `apex.configs.security`    | `error`                                               | Security rules only            |
| `apex.configs.performance` | `error`                                               | Performance rules only         |

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
      'apex/perf-no-dml-in-loop': 'error',
      'apex/best-test-has-asserts': 'warn',
      // disable a rule
      'apex/doc-require-apexdoc': 'off',
    },
  },
];
```

## Rule Reference

**Default** reflects `apex.configs.recommended`: `problem` + `recommended: true` → `error`; `suggestion` + `recommended: true` → `warn`; `recommended: false` → `off`.

### Best Practices

| Rule                                                                                                | Description                                                                             | PMD equivalent                                                          | Default |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------- |
| [apex/best-debug-use-logging-level](docs/rules/best-practices/debug-use-logging-level.md)           | System.debug() calls should specify a LoggingLevel argument                             | `DebugsShouldUseLoggingLevel`                                           | warn    |
| [apex/best-no-future-annotation](docs/rules/best-practices/no-future-annotation.md)                 | Prefer Queueable over @Future — the future annotation has significant limitations       | `AvoidFutureAnnotation`                                                 | off     |
| [apex/best-no-global-modifier](docs/rules/best-practices/no-global-modifier.md)                     | Avoid 'global' class modifier — it permanently locks the public API in managed packages | `AvoidGlobalModifier`                                                   | warn    |
| [apex/best-no-logic-in-trigger](docs/rules/best-practices/no-logic-in-trigger.md)                   | Avoid placing business logic directly in triggers — delegate to handler classes         | `AvoidLogicInTrigger`                                                   | warn    |
| [apex/best-no-unused-local-variable](docs/rules/best-practices/no-unused-local-variable.md)         | Detects local variables that are declared but never read                                | `UnusedLocalVariable`                                                   | off     |
| [apex/best-queueable-needs-finalizer](docs/rules/best-practices/queueable-needs-finalizer.md)       | Queueable classes should attach a Finalizer for error recovery                          | `QueueableWithoutFinalizer` (+ legacy `QueueableShouldAttachFinalizer`) | off     |
| [apex/best-test-assertions-have-message](docs/rules/best-practices/test-assertions-have-message.md) | System.assert() calls should include a message parameter for clarity                    | `ApexAssertionsShouldIncludeMessage`                                    | warn    |
| [apex/best-test-has-asserts](docs/rules/best-practices/test-has-asserts.md)                         | Apex unit test classes should include at least one assertion                            | `ApexUnitTestClassShouldHaveAsserts`                                    | warn    |
| [apex/best-test-has-run-as](docs/rules/best-practices/test-has-run-as.md)                           | Test classes should include at least one System.runAs() call                            | `ApexUnitTestClassShouldHaveRunAs`                                      | warn    |
| [apex/best-test-method-annotation](docs/rules/best-practices/test-method-annotation.md)             | Use @IsTest annotation instead of the deprecated 'testMethod' keyword                   | `ApexUnitTestMethodShouldHaveIsTestAnnotation`                          | warn    |
| [apex/best-test-no-see-all-data](docs/rules/best-practices/test-no-see-all-data.md)                 | Avoid @isTest(seeAllData=true) as it exposes real org data to test modifications        | `ApexUnitTestShouldNotUseSeeAllDataTrue`                                | error   |

### Code Style

| Rule                                                                                     | Description                                                   | PMD equivalent                                                                                                                                                                        | Default |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| [apex/style-annotation-naming](docs/rules/code-style/annotation-naming.md)               | Annotation names should use PascalCase                        | `AnnotationsNamingConventions`                                                                                                                                                        | warn    |
| [apex/style-braces-for-for](docs/rules/code-style/braces-for-for.md)                     | Require braces around for loop bodies                         | `ForLoopsMustUseBraces`                                                                                                                                                               | warn    |
| [apex/style-braces-for-if](docs/rules/code-style/braces-for-if.md)                       | Require braces around if/else statement bodies                | `IfStmtsMustUseBraces` / `IfElseStmtsMustUseBraces`                                                                                                                                   | warn    |
| [apex/style-braces-for-while](docs/rules/code-style/braces-for-while.md)                 | Require braces around while loop bodies                       | `WhileLoopsMustUseBraces`                                                                                                                                                             | warn    |
| [apex/style-fields-at-start](docs/rules/code-style/fields-at-start.md)                   | Field declarations should appear before method declarations   | `FieldDeclarationsShouldBeAtStart`                                                                                                                                                    | warn    |
| [apex/style-naming-conventions](docs/rules/code-style/naming-conventions.md)             | Enforce configurable naming conventions for Apex declarations | `ClassNamingConventions` / `MethodNamingConventions` / `FieldNamingConventions` / `LocalVariableNamingConventions` / `FormalParameterNamingConventions` / `PropertyNamingConventions` | warn    |
| [apex/style-one-declaration-per-line](docs/rules/code-style/one-declaration-per-line.md) | Declare only one variable per statement                       | `OneDeclarationPerLine`                                                                                                                                                               | warn    |

### Design

| Rule                                                                              | Description                                                               | PMD equivalent                                     | Default |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| [apex/design-cognitive-complexity](docs/rules/design/cognitive-complexity.md)     | Limit cognitive complexity of methods and classes                         | `CognitiveComplexity`                              | warn    |
| [apex/design-cyclomatic-complexity](docs/rules/design/cyclomatic-complexity.md)   | Limit cyclomatic complexity of methods and classes                        | `CyclomaticComplexity` / `StdCyclomaticComplexity` | warn    |
| [apex/design-excessive-parameters](docs/rules/design/excessive-parameters.md)     | Flag methods with too many parameters                                     | `ExcessiveParameterList`                           | warn    |
| [apex/design-excessive-public-count](docs/rules/design/excessive-public-count.md) | Flag classes with too many public methods or attributes                   | `ExcessivePublicCount`                             | warn    |
| [apex/design-ncss-method-count](docs/rules/design/ncss-method-count.md)           | Limit the number of non-commenting source statements per method and class | `NcssMethodCount` / `NcssCount` / `NcssTypeCount`  | warn    |
| [apex/design-no-boolean-parameters](docs/rules/design/no-boolean-parameters.md)   | Avoid boolean parameters in public and global methods                     | `AvoidBooleanMethodParameters`                     | warn    |
| [apex/design-no-deep-nesting](docs/rules/design/no-deep-nesting.md)               | Avoid deeply nested if statements                                         | `AvoidDeeplyNestedIfStmts`                         | warn    |
| [apex/design-no-unused-method](docs/rules/design/no-unused-method.md)             | Detect private methods that are never called within the class             | `UnusedMethod`                                     | off     |
| [apex/design-too-many-fields](docs/rules/design/too-many-fields.md)               | Flag classes with too many fields                                         | `TooManyFields`                                    | warn    |

### Documentation

| Rule                                                                    | Description                                                                    | PMD equivalent | Default |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------- | ------- |
| [apex/doc-require-apexdoc](docs/rules/documentation/require-apexdoc.md) | Require ApexDoc comments on public and global classes, methods, and properties | `ApexDoc`      | off     |

### Error Prone

| Rule                                                                                                | Description                                                                                  | PMD equivalent                                                                                          | Default |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------- |
| [apex/error-aura-enabled-getter-public](docs/rules/error-prone/aura-enabled-getter-public.md)       | @AuraEnabled property getters must be public or global                                       | `InaccessibleAuraEnabledGetter` (older docs sometimes mis-labeled this as AuraEnabledWithoutCatchBlock) | error   |
| [apex/error-no-csrf-in-constructor](docs/rules/error-prone/no-csrf-in-constructor.md)               | Disallow DML operations in constructors or class initializers                                | `ApexCSRF`                                                                                              | error   |
| [apex/error-no-direct-trigger-map-access](docs/rules/error-prone/no-direct-trigger-map-access.md)   | Avoid direct index access to Trigger.new or Trigger.old — iterate instead                    | `AvoidDirectAccessTriggerMap`                                                                           | error   |
| [apex/error-no-empty-catch](docs/rules/error-prone/no-empty-catch.md)                               | Disallow empty catch blocks                                                                  | `EmptyCatchBlock`                                                                                       | error   |
| [apex/error-no-empty-if](docs/rules/error-prone/no-empty-if.md)                                     | Disallow empty if statement bodies                                                           | `EmptyIfStmt`                                                                                           | error   |
| [apex/error-no-empty-try](docs/rules/error-prone/no-empty-try.md)                                   | Disallow empty try or finally blocks                                                         | `EmptyTryOrFinallyBlock`                                                                                | error   |
| [apex/error-no-empty-while](docs/rules/error-prone/no-empty-while.md)                               | Disallow empty while loop bodies                                                             | `EmptyWhileStmt`                                                                                        | error   |
| [apex/error-no-hardcoded-id](docs/rules/error-prone/no-hardcoded-id.md)                             | Avoid hardcoding Salesforce record IDs — they differ between environments                    | `AvoidHardcodingId`                                                                                     | error   |
| [apex/error-no-method-name-as-class](docs/rules/error-prone/no-method-name-as-class.md)             | Non-constructor methods should not share the name of the enclosing class                     | `MethodWithSameNameAsEnclosingClass`                                                                    | error   |
| [apex/error-no-nonexistent-annotation](docs/rules/error-prone/no-nonexistent-annotation.md)         | Avoid annotations that do not exist in Apex                                                  | `AvoidNonExistentAnnotations` (+ legacy `NonExistentCustomSettingOrMetadata`)                           | error   |
| [apex/error-no-stateful-db-result](docs/rules/error-prone/no-stateful-db-result.md)                 | Avoid storing Database result types as instance variables in Database.Stateful batch classes | `AvoidStatefulDatabaseResult`                                                                           | off     |
| [apex/error-no-type-shadow-namespace](docs/rules/error-prone/no-type-shadow-namespace.md)           | Avoid declaring types with the same name as System or Schema namespace types                 | `TypeShadowsBuiltInNamespace` (+ legacy `AvoidShadowingField`)                                          | off     |
| [apex/error-override-both-equals-hashcode](docs/rules/error-prone/override-both-equals-hashcode.md) | If overriding equals(), also override hashCode(), and vice versa                             | `OverrideBothEqualsAndHashcode`                                                                         | error   |
| [apex/error-test-methods-in-test-class](docs/rules/error-prone/test-methods-in-test-class.md)       | @IsTest methods must reside in @IsTest annotated classes                                     | `TestMethodsMustBeInTestClasses`                                                                        | error   |

### Performance

| Rule                                                                                     | Description                                                                    | PMD equivalent                                                                                          | Default |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------- |
| [apex/perf-no-debug-statements](docs/rules/performance/no-debug-statements.md)           | Remove or gate System.debug() calls in production code                         | `AvoidDebugStatements`                                                                                  | off     |
| [apex/perf-no-dml-in-loop](docs/rules/performance/no-dml-in-loop.md)                     | Avoid DML operations, SOQL queries, and governor-limited calls inside loops    | `OperationWithLimitsInLoop` (+ legacy `AvoidDmlStatementsInLoops`)                                      | error   |
| [apex/perf-no-eager-describe](docs/rules/performance/no-eager-describe.md)               | Avoid calling Schema.describe\*() methods inside loops — cache results instead | `AvoidEagerDescribes` (distinct from `EagerlyLoadedDescribeSObjectResult`)                              | error   |
| [apex/perf-no-high-cost-in-loop](docs/rules/performance/no-high-cost-in-loop.md)         | Avoid high-cost Apex calls inside loops                                        | `OperationWithHighCostInLoop` (+ legacy `AvoidSoqlInLoops` / `AvoidHighCostInLoopWithoutBulkification`) | error   |
| [apex/perf-no-non-restrictive-query](docs/rules/performance/no-non-restrictive-query.md) | SOQL queries should include a WHERE clause to limit results                    | `AvoidNonRestrictiveQueries` (+ legacy `WherelessSOQLQuery`)                                            | error   |

### Security

| Rule                                                                                | Description                                                                            | PMD equivalent              | Default |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------- | ------- |
| [apex/security-crud-violation](docs/rules/security/crud-violation.md)               | DML operations and SOQL queries should include CRUD/FLS permission checks              | `ApexCRUDViolation`         | warn    |
| [apex/security-no-dangerous-methods](docs/rules/security/no-dangerous-methods.md)   | Flag potentially dangerous Apex method calls                                           | `ApexDangerousMethods`      | warn    |
| [apex/security-no-hardcoded-crypto](docs/rules/security/no-hardcoded-crypto.md)     | Avoid hardcoded cryptographic keys or IVs                                              | `ApexBadCrypto`             | error   |
| [apex/security-no-insecure-endpoint](docs/rules/security/no-insecure-endpoint.md)   | HTTP callout endpoints must use HTTPS                                                  | `ApexInsecureEndpoint`      | error   |
| [apex/security-no-open-redirect](docs/rules/security/no-open-redirect.md)           | Avoid constructing PageReference from user-controlled input                            | `ApexOpenRedirect`          | error   |
| [apex/security-no-soql-injection](docs/rules/security/no-soql-injection.md)         | Avoid SOQL injection — use bind variables or String.escapeSingleQuotes()               | `ApexSOQLInjection`         | error   |
| [apex/security-no-xss-false-escape](docs/rules/security/no-xss-false-escape.md)     | Disabling HTML escaping (escape=false) can introduce XSS vulnerabilities               | `ApexXSSFromEscapeFalse`    | error   |
| [apex/security-no-xss-from-url](docs/rules/security/no-xss-from-url.md)             | URL parameter values must be sanitized before output to prevent XSS                    | `ApexXSSFromURLParam`       | error   |
| [apex/security-sharing-violations](docs/rules/security/sharing-violations.md)       | Classes that access data should explicitly declare 'with sharing' or 'without sharing' | `ApexSharingViolations`     | warn    |
| [apex/security-use-named-credentials](docs/rules/security/use-named-credentials.md) | Use Named Credentials instead of hardcoding authentication details in HTTP requests    | `ApexSuggestUsingNamedCred` | warn    |

## PMD Converter

The [PMD Converter](https://joernberkefeld.github.io/eslint-plugin-apex/) is a browser-based tool that converts PMD Apex XML rule files into:

1. An ESLint flat-config snippet with the correct rule IDs and severities
2. A rule implementation skeleton (when the PMD rule is not yet in this plugin)

No data is sent anywhere — conversion happens entirely in the browser.

### PMD rules in the reference mirror without an ESLint twin (yet)

The offline PMD rule list this project tracks includes **ExcessiveClassLength**, **EmptyStatementBlock**, **EagerlyLoadedDescribeSObjectResult**, and **NcssConstructorCount**. They are intentionally **not** mapped to an `apex/*` rule today; the converter emits a `custom-…` skeleton for them. See the per-rule notes for [perf-no-eager-describe](docs/rules/performance/no-eager-describe.md) versus **EagerlyLoadedDescribeSObjectResult**, and [design-ncss-method-count](docs/rules/design/ncss-method-count.md) versus per-constructor NCSS.

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
│   ├── rules.test.js       ← RuleTester tests for all rules
│   └── docs-coverage.test.js
└── docs/
    ├── index.html          ← GitHub Pages PMD converter
    └── rules/              ← one Markdown page per registered rule
        ├── best-practices/
        ├── code-style/
        ├── design/
        ├── documentation/
        ├── error-prone/
        ├── performance/
        └── security/
```

The parser uses [`@apexdevtools/apex-parser`](https://github.com/apex-dev-tools/apex-parser), an ANTLR4-based Apex parser, and wraps its concrete syntax tree into a flat, traversable AST with custom node types.

## Contributing

Contributions welcome — especially:

- Improved AST coverage for edge-case Apex constructs
- More comprehensive rule implementations
- Additional test cases

## License

MIT — see [LICENSE](./LICENSE).
