/**
 * eslint-plugin-apex
 *
 * ESLint plugin for Salesforce Apex — ports 57 ESLint rules aligned with the
 * ESLint ecosystem using @apexdevtools/apex-parser as the language parser.
 *
 * Usage (eslint.config.js flat config):
 *
 *   import apex from 'eslint-plugin-apex';
 *   export default [
 *     apex.configs.recommended,
 *   ];
 */

import { parseForESLint, parse } from './apex-parser.js';
import { VISITOR_KEYS } from './node-types.js';

// ── Best Practices ─────────────────────────────────────────────────────────
import testHasAsserts from './rules/best-practices/test-has-asserts.js';
import testNoSeeAllData from './rules/best-practices/test-no-see-all-data.js';
import testHasRunAs from './rules/best-practices/test-has-run-as.js';
import testMethodAnnotation from './rules/best-practices/test-method-annotation.js';
import noGlobalModifier from './rules/best-practices/no-global-modifier.js';
import noLogicInTrigger from './rules/best-practices/no-logic-in-trigger.js';
import debugUseLoggingLevel from './rules/best-practices/debug-use-logging-level.js';
import noFutureAnnotation from './rules/best-practices/no-future-annotation.js';
import queueableNeedsFinalizer from './rules/best-practices/queueable-needs-finalizer.js';
import noUnusedLocalVariable from './rules/best-practices/no-unused-local-variable.js';
import testAssertionsHaveMessage from './rules/best-practices/test-assertions-have-message.js';

// ── Code Style ─────────────────────────────────────────────────────────────
import namingConventions from './rules/code-style/naming-conventions.js';
import bracesForIf from './rules/code-style/braces-for-if.js';
import bracesForFor from './rules/code-style/braces-for-for.js';
import bracesForWhile from './rules/code-style/braces-for-while.js';
import fieldsAtStart from './rules/code-style/fields-at-start.js';
import oneDeclarationPerLine from './rules/code-style/one-declaration-per-line.js';
import annotationNaming from './rules/code-style/annotation-naming.js';

// ── Design ─────────────────────────────────────────────────────────────────
import cyclomaticComplexity from './rules/design/cyclomatic-complexity.js';
import cognitiveComplexity from './rules/design/cognitive-complexity.js';
import noDeepNesting from './rules/design/no-deep-nesting.js';
import excessiveParameters from './rules/design/excessive-parameters.js';
import excessivePublicCount from './rules/design/excessive-public-count.js';
import tooManyFields from './rules/design/too-many-fields.js';
import noBooleanParameters from './rules/design/no-boolean-parameters.js';
import ncssMethodCount from './rules/design/ncss-method-count.js';
import noUnusedMethod from './rules/design/no-unused-method.js';

// ── Documentation ──────────────────────────────────────────────────────────
import requireApexdoc from './rules/documentation/require-apexdoc.js';

// ── Error Prone ────────────────────────────────────────────────────────────
import noEmptyCatch from './rules/error-prone/no-empty-catch.js';
import noEmptyIf from './rules/error-prone/no-empty-if.js';
import noEmptyWhile from './rules/error-prone/no-empty-while.js';
import noEmptyTry from './rules/error-prone/no-empty-try.js';
import noCsrfInConstructor from './rules/error-prone/no-csrf-in-constructor.js';
import noHardcodedId from './rules/error-prone/no-hardcoded-id.js';
import noDirectTriggerMapAccess from './rules/error-prone/no-direct-trigger-map-access.js';
import noNonexistentAnnotation from './rules/error-prone/no-nonexistent-annotation.js';
import noStatefulDbResult from './rules/error-prone/no-stateful-db-result.js';
import auraEnabledGetterPublic from './rules/error-prone/aura-enabled-getter-public.js';
import noMethodNameAsClass from './rules/error-prone/no-method-name-as-class.js';
import overrideBothEqualsHashcode from './rules/error-prone/override-both-equals-hashcode.js';
import testMethodsInTestClass from './rules/error-prone/test-methods-in-test-class.js';
import noTypeShadowNamespace from './rules/error-prone/no-type-shadow-namespace.js';

// ── Performance ────────────────────────────────────────────────────────────
import noDmlInLoop from './rules/performance/no-dml-in-loop.js';
import noDebugStatements from './rules/performance/no-debug-statements.js';
import noNonRestrictiveQuery from './rules/performance/no-non-restrictive-query.js';
import noEagerDescribe from './rules/performance/no-eager-describe.js';
import noHighCostInLoop from './rules/performance/no-high-cost-in-loop.js';

// ── Security ───────────────────────────────────────────────────────────────
import noHardcodedCrypto from './rules/security/no-hardcoded-crypto.js';
import crudViolation from './rules/security/crud-violation.js';
import noDangerousMethods from './rules/security/no-dangerous-methods.js';
import noInsecureEndpoint from './rules/security/no-insecure-endpoint.js';
import noOpenRedirect from './rules/security/no-open-redirect.js';
import sharingViolations from './rules/security/sharing-violations.js';
import noSoqlInjection from './rules/security/no-soql-injection.js';
import useNamedCredentials from './rules/security/use-named-credentials.js';
import noXssFalseEscape from './rules/security/no-xss-false-escape.js';
import noXssFromUrl from './rules/security/no-xss-from-url.js';

// ── Rule registry ──────────────────────────────────────────────────────────

const rules = {
    // Best Practices
    'best-test-has-asserts': testHasAsserts,
    'best-test-no-see-all-data': testNoSeeAllData,
    'best-test-has-run-as': testHasRunAs,
    'best-test-method-annotation': testMethodAnnotation,
    'best-no-global-modifier': noGlobalModifier,
    'best-no-logic-in-trigger': noLogicInTrigger,
    'best-debug-use-logging-level': debugUseLoggingLevel,
    'best-no-future-annotation': noFutureAnnotation,
    'best-queueable-needs-finalizer': queueableNeedsFinalizer,
    'best-no-unused-local-variable': noUnusedLocalVariable,
    'best-test-assertions-have-message': testAssertionsHaveMessage,

    // Code Style
    'style-naming-conventions': namingConventions,
    'style-braces-for-if': bracesForIf,
    'style-braces-for-for': bracesForFor,
    'style-braces-for-while': bracesForWhile,
    'style-fields-at-start': fieldsAtStart,
    'style-one-declaration-per-line': oneDeclarationPerLine,
    'style-annotation-naming': annotationNaming,

    // Design
    'design-cyclomatic-complexity': cyclomaticComplexity,
    'design-cognitive-complexity': cognitiveComplexity,
    'design-no-deep-nesting': noDeepNesting,
    'design-excessive-parameters': excessiveParameters,
    'design-excessive-public-count': excessivePublicCount,
    'design-too-many-fields': tooManyFields,
    'design-no-boolean-parameters': noBooleanParameters,
    'design-ncss-method-count': ncssMethodCount,
    'design-no-unused-method': noUnusedMethod,

    // Documentation
    'doc-require-apexdoc': requireApexdoc,

    // Error Prone
    'error-no-empty-catch': noEmptyCatch,
    'error-no-empty-if': noEmptyIf,
    'error-no-empty-while': noEmptyWhile,
    'error-no-empty-try': noEmptyTry,
    'error-no-csrf-in-constructor': noCsrfInConstructor,
    'error-no-hardcoded-id': noHardcodedId,
    'error-no-direct-trigger-map-access': noDirectTriggerMapAccess,
    'error-no-nonexistent-annotation': noNonexistentAnnotation,
    'error-no-stateful-db-result': noStatefulDbResult,
    'error-aura-enabled-getter-public': auraEnabledGetterPublic,
    'error-no-method-name-as-class': noMethodNameAsClass,
    'error-override-both-equals-hashcode': overrideBothEqualsHashcode,
    'error-test-methods-in-test-class': testMethodsInTestClass,
    'error-no-type-shadow-namespace': noTypeShadowNamespace,

    // Performance
    'perf-no-dml-in-loop': noDmlInLoop,
    'perf-no-debug-statements': noDebugStatements,
    'perf-no-non-restrictive-query': noNonRestrictiveQuery,
    'perf-no-eager-describe': noEagerDescribe,
    'perf-no-high-cost-in-loop': noHighCostInLoop,

    // Security
    'security-no-hardcoded-crypto': noHardcodedCrypto,
    'security-crud-violation': crudViolation,
    'security-no-dangerous-methods': noDangerousMethods,
    'security-no-insecure-endpoint': noInsecureEndpoint,
    'security-no-open-redirect': noOpenRedirect,
    'security-sharing-violations': sharingViolations,
    'security-no-soql-injection': noSoqlInjection,
    'security-use-named-credentials': useNamedCredentials,
    'security-no-xss-false-escape': noXssFalseEscape,
    'security-no-xss-from-url': noXssFromUrl,
};

// ── Parser configuration ────────────────────────────────────────────────────

const languageOptions = {
    parser: { parseForESLint, parse },
};

// ── File patterns ───────────────────────────────────────────────────────────

const FILES = ['**/*.cls', '**/*.trigger', '**/*.apex'];

// ── Priority → severity mapping ─────────────────────────────────────────────
// PMD priority 1-2 → error, priority 3 → warn, priority 4-5 → off by default

/**
 * Build rule severities for a config.
 *
 * @param {'recommended'|'strict'|'security'|'performance'} profile
 */
function buildRules(profile) {
    const result = {};

    for (const [key, rule] of Object.entries(rules)) {
        if (profile === 'strict') {
            result[`apex/${key}`] = 'error';
            continue;
        }
        if (profile === 'security') {
            if (key.startsWith('security-')) {
                result[`apex/${key}`] = 'error';
            }
            continue;
        }
        if (profile === 'performance') {
            if (key.startsWith('perf-')) {
                result[`apex/${key}`] = 'error';
            }
            continue;
        }
        // recommended: use the rule's recommended flag and type
        const type = rule.meta?.type || 'suggestion';
        const recommended = rule.meta?.docs?.recommended ?? false;
        if (!recommended) {
            result[`apex/${key}`] = 'off';
        } else if (type === 'problem') {
            result[`apex/${key}`] = 'error';
        } else {
            result[`apex/${key}`] = 'warn';
        }
    }

    return result;
}

// ── Plugin definition ───────────────────────────────────────────────────────

const plugin = {
    meta: {
        name: 'eslint-plugin-apex',
        version: '0.1.1',
    },
    rules,
    // Flat-config-compatible configs
    configs: {}, // populated below after plugin is defined
};

plugin.configs = {
    recommended: {
        name: 'apex/recommended',
        files: FILES,
        plugins: { apex: plugin },
        languageOptions,
        rules: buildRules('recommended'),
    },
    strict: {
        name: 'apex/strict',
        files: FILES,
        plugins: { apex: plugin },
        languageOptions,
        rules: buildRules('strict'),
    },
    security: {
        name: 'apex/security',
        files: FILES,
        plugins: { apex: plugin },
        languageOptions,
        rules: buildRules('security'),
    },
    performance: {
        name: 'apex/performance',
        files: FILES,
        plugins: { apex: plugin },
        languageOptions,
        rules: buildRules('performance'),
    },
};

export default plugin;
export { rules, languageOptions };
