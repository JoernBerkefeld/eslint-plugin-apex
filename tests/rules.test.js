/**
 * Rule tests for eslint-plugin-apex.
 *
 * Uses ESLint's RuleTester with the custom Apex parser to verify that each
 * rule correctly identifies valid (no errors) and invalid (with errors) code.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RuleTester } from 'eslint';
import { parseForESLint, parse } from '../src/apex-parser.js';
import { VISITOR_KEYS } from '../src/node-types.js';

// ── Import all rules ───────────────────────────────────────────────────────
import testHasAsserts from '../src/rules/best-practices/test-has-asserts.js';
import testNoSeeAllData from '../src/rules/best-practices/test-no-see-all-data.js';
import testHasRunAs from '../src/rules/best-practices/test-has-run-as.js';
import testMethodAnnotation from '../src/rules/best-practices/test-method-annotation.js';
import noGlobalModifier from '../src/rules/best-practices/no-global-modifier.js';
import noLogicInTrigger from '../src/rules/best-practices/no-logic-in-trigger.js';
import debugUseLoggingLevel from '../src/rules/best-practices/debug-use-logging-level.js';
import noFutureAnnotation from '../src/rules/best-practices/no-future-annotation.js';
import queueableNeedsFinalizer from '../src/rules/best-practices/queueable-needs-finalizer.js';
import noUnusedLocalVariable from '../src/rules/best-practices/no-unused-local-variable.js';
import testAssertionsHaveMessage from '../src/rules/best-practices/test-assertions-have-message.js';

import namingConventions from '../src/rules/code-style/naming-conventions.js';
import bracesForIf from '../src/rules/code-style/braces-for-if.js';
import bracesForFor from '../src/rules/code-style/braces-for-for.js';
import bracesForWhile from '../src/rules/code-style/braces-for-while.js';
import fieldsAtStart from '../src/rules/code-style/fields-at-start.js';
import oneDeclarationPerLine from '../src/rules/code-style/one-declaration-per-line.js';
import annotationNaming from '../src/rules/code-style/annotation-naming.js';

import cyclomaticComplexity from '../src/rules/design/cyclomatic-complexity.js';
import cognitiveComplexity from '../src/rules/design/cognitive-complexity.js';
import noDeepNesting from '../src/rules/design/no-deep-nesting.js';
import excessiveParameters from '../src/rules/design/excessive-parameters.js';
import excessivePublicCount from '../src/rules/design/excessive-public-count.js';
import tooManyFields from '../src/rules/design/too-many-fields.js';
import noBooleanParameters from '../src/rules/design/no-boolean-parameters.js';
import ncssMethodCount from '../src/rules/design/ncss-method-count.js';
import noUnusedMethod from '../src/rules/design/no-unused-method.js';

import requireApexdoc from '../src/rules/documentation/require-apexdoc.js';

import noEmptyCatch from '../src/rules/error-prone/no-empty-catch.js';
import noEmptyIf from '../src/rules/error-prone/no-empty-if.js';
import noEmptyWhile from '../src/rules/error-prone/no-empty-while.js';
import noEmptyTry from '../src/rules/error-prone/no-empty-try.js';
import noCsrfInConstructor from '../src/rules/error-prone/no-csrf-in-constructor.js';
import noHardcodedId from '../src/rules/error-prone/no-hardcoded-id.js';
import noDirectTriggerMapAccess from '../src/rules/error-prone/no-direct-trigger-map-access.js';
import noNonexistentAnnotation from '../src/rules/error-prone/no-nonexistent-annotation.js';
import noStatefulDbResult from '../src/rules/error-prone/no-stateful-db-result.js';
import auraEnabledGetterPublic from '../src/rules/error-prone/aura-enabled-getter-public.js';
import noMethodNameAsClass from '../src/rules/error-prone/no-method-name-as-class.js';
import overrideBothEqualsHashcode from '../src/rules/error-prone/override-both-equals-hashcode.js';
import testMethodsInTestClass from '../src/rules/error-prone/test-methods-in-test-class.js';
import noTypeShadowNamespace from '../src/rules/error-prone/no-type-shadow-namespace.js';

import noDmlInLoop from '../src/rules/performance/no-dml-in-loop.js';
import noDebugStatements from '../src/rules/performance/no-debug-statements.js';
import noNonRestrictiveQuery from '../src/rules/performance/no-non-restrictive-query.js';
import noEagerDescribe from '../src/rules/performance/no-eager-describe.js';
import noHighCostInLoop from '../src/rules/performance/no-high-cost-in-loop.js';

import noHardcodedCrypto from '../src/rules/security/no-hardcoded-crypto.js';
import crudViolation from '../src/rules/security/crud-violation.js';
import noDangerousMethods from '../src/rules/security/no-dangerous-methods.js';
import noInsecureEndpoint from '../src/rules/security/no-insecure-endpoint.js';
import noOpenRedirect from '../src/rules/security/no-open-redirect.js';
import sharingViolations from '../src/rules/security/sharing-violations.js';
import noSoqlInjection from '../src/rules/security/no-soql-injection.js';
import useNamedCredentials from '../src/rules/security/use-named-credentials.js';
import noXssFalseEscape from '../src/rules/security/no-xss-false-escape.js';
import noXssFromUrl from '../src/rules/security/no-xss-from-url.js';

// ── RuleTester configuration ───────────────────────────────────────────────

const tester = new RuleTester({
    languageOptions: {
        parser: { parseForESLint, parse },
    },
});

// Helper: create a .cls test case
function cls(code) {
    return { code, filename: 'Test.cls' };
}

// Helper: create a .trigger test case
function trig(code) {
    return { code, filename: 'Test.trigger' };
}

// ── Best Practices ─────────────────────────────────────────────────────────

describe('best/test-has-asserts', () => {
    it('runs', () => {
        tester.run('best-test-has-asserts', testHasAsserts, {
            valid: [
                cls('@isTest\npublic class T {\n  @isTest\n  static void t() {\n    System.assert(true);\n  }\n}'),
                cls('public class Foo { public void bar() {} }'),
            ],
            invalid: [
                {
                    ...cls('@isTest\npublic class T {\n  @isTest\n  static void t() { Integer x = 1; }\n}'),
                    errors: [{ messageId: 'missingAssert' }],
                },
            ],
        });
    });
});

describe('best/test-no-see-all-data', () => {
    it('runs', () => {
        tester.run('best-test-no-see-all-data', testNoSeeAllData, {
            valid: [
                cls('@isTest\npublic class T {}'),
                cls('@isTest(seeAllData=false)\npublic class T {}'),
            ],
            invalid: [
                {
                    ...cls('@isTest(seeAllData=true)\npublic class T {}'),
                    errors: [{ messageId: 'seeAllData' }],
                },
            ],
        });
    });
});

describe('best/test-method-annotation', () => {
    it('runs', () => {
        tester.run('best-test-method-annotation', testMethodAnnotation, {
            valid: [
                cls('public class Foo {\n  @isTest\n  static void t() {}\n}'),
            ],
            invalid: [
                {
                    ...cls('public class Foo {\n  static testMethod void t() {}\n}'),
                    errors: [{ messageId: 'useAnnotation' }],
                },
            ],
        });
    });
});

describe('best/no-global-modifier', () => {
    it('runs', () => {
        tester.run('best-no-global-modifier', noGlobalModifier, {
            valid: [
                cls('public class Foo {}'),
            ],
            invalid: [
                {
                    ...cls('global class Foo {}'),
                    errors: [{ messageId: 'globalModifier' }],
                },
            ],
        });
    });
});

describe('best/no-logic-in-trigger', () => {
    it('runs', () => {
        tester.run('best-no-logic-in-trigger', noLogicInTrigger, {
            valid: [
                trig('trigger T on Account (before insert) { AccountHandler.run(); }'),
            ],
            invalid: [
                {
                    ...trig('trigger T on Account (before insert) { if (Trigger.isBefore) { } }'),
                    errors: [{ messageId: 'logicInTrigger' }],
                },
            ],
        });
    });
});

describe('best/debug-use-logging-level', () => {
    it('runs', () => {
        tester.run('best-debug-use-logging-level', debugUseLoggingLevel, {
            valid: [
                cls('public class Foo { public void run() { System.debug(LoggingLevel.INFO, \'msg\'); } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { System.debug(\'msg\'); } }'),
                    errors: [{ messageId: 'missingLevel' }],
                },
            ],
        });
    });
});

describe('best/no-future-annotation', () => {
    it('runs', () => {
        tester.run('best-no-future-annotation', noFutureAnnotation, {
            valid: [
                cls('public class Foo { public void run() {} }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo {\n  @future\n  public static void run() {}\n}'),
                    errors: [{ messageId: 'useFuture' }],
                },
            ],
        });
    });
});

// ── Code Style ─────────────────────────────────────────────────────────────

describe('style/braces-for-if', () => {
    it('runs', () => {
        tester.run('style-braces-for-if', bracesForIf, {
            valid: [
                cls('public class Foo { public void run() { if (true) {} } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { if (true) return; } }'),
                    errors: [{ messageId: 'missingBraces' }],
                },
            ],
        });
    });
});

describe('style/braces-for-for', () => {
    it('runs', () => {
        tester.run('style-braces-for-for', bracesForFor, {
            valid: [
                cls('public class Foo { public void run() { for (Integer i = 0; i < 1; i++) {} } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { for (Integer i = 0; i < 1; i++) return; } }'),
                    errors: [{ messageId: 'missingBraces' }],
                },
            ],
        });
    });
});

describe('style/braces-for-while', () => {
    it('runs', () => {
        tester.run('style-braces-for-while', bracesForWhile, {
            valid: [
                cls('public class Foo { public void run() { while (false) {} } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { while (false) return; } }'),
                    errors: [{ messageId: 'missingBraces' }],
                },
            ],
        });
    });
});

describe('style/one-declaration-per-line', () => {
    it('runs', () => {
        tester.run('style-one-declaration-per-line', oneDeclarationPerLine, {
            valid: [
                cls('public class Foo { public void run() { Integer x = 1; } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { Integer x = 1, y = 2; } }'),
                    errors: [{ messageId: 'multipleDeclarators' }],
                },
            ],
        });
    });
});

// ── Design ─────────────────────────────────────────────────────────────────

describe('design/excessive-parameters', () => {
    it('runs', () => {
        tester.run('design-excessive-parameters', excessiveParameters, {
            valid: [
                cls('public class Foo { public void run(String a, String b) {} }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run(String a, String b, String c, String d, String e) {} }'),
                    errors: [{ messageId: 'tooManyParams' }],
                },
            ],
        });
    });
});

describe('design/no-deep-nesting', () => {
    it('runs', () => {
        tester.run('design-no-deep-nesting', noDeepNesting, {
            valid: [
                cls('public class Foo { public void run() { if (true) { if (true) {} } } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { if (true) { if (true) { if (true) { if (true) {} } } } } }'),
                    errors: [{ messageId: 'tooDeep' }],
                },
            ],
        });
    });
});

describe('design/no-boolean-parameters', () => {
    it('runs', () => {
        tester.run('design-no-boolean-parameters', noBooleanParameters, {
            valid: [
                cls('public class Foo { public void run(String mode) {} }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run(Boolean isActive) {} }'),
                    errors: [{ messageId: 'booleanParam' }],
                },
            ],
        });
    });
});

describe('design/too-many-fields', () => {
    it('runs', () => {
        tester.run('design-too-many-fields', tooManyFields, {
            valid: [
                cls('public class Foo { private String a; private String b; }'),
            ],
            invalid: [
                {
                    ...cls(`public class Foo {
  private String a; private String b; private String c;
  private String d; private String e; private String f;
  private String g; private String h; private String i;
  private String j; private String k; private String l;
  private String m; private String n; private String o;
  private String p;
}`),
                    options: [{ minimum: 15 }],
                    errors: [{ messageId: 'tooManyFields' }],
                },
            ],
        });
    });
});

// ── Error Prone ────────────────────────────────────────────────────────────

describe('error/no-empty-catch', () => {
    it('runs', () => {
        tester.run('error-no-empty-catch', noEmptyCatch, {
            valid: [
                cls('public class Foo { public void run() { try {} catch(Exception e) { System.debug(e); } } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { try {} catch(Exception e) {} } }'),
                    errors: [{ messageId: 'emptyCatch' }],
                },
            ],
        });
    });
});

describe('error/no-empty-if', () => {
    it('runs', () => {
        tester.run('error-no-empty-if', noEmptyIf, {
            valid: [
                cls('public class Foo { public void run() { if (true) { return; } } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { if (true) {} } }'),
                    errors: [{ messageId: 'emptyIf' }],
                },
            ],
        });
    });
});

describe('error/no-hardcoded-id', () => {
    it('runs', () => {
        tester.run('error-no-hardcoded-id', noHardcodedId, {
            valid: [
                cls("public class Foo { public void run() { String s = 'hello world'; } }"),
            ],
            invalid: [
                {
                    ...cls("public class Foo { public void run() { Id i = '001000000000001'; } }"),
                    errors: [{ messageId: 'hardcodedId' }],
                },
            ],
        });
    });
});

describe('error/override-both-equals-hashcode', () => {
    it('runs', () => {
        tester.run('error-override-both-equals-hashcode', overrideBothEqualsHashcode, {
            valid: [
                cls('public class Foo { public Boolean equals(Object o) { return true; } public Integer hashCode() { return 1; } }'),
                cls('public class Foo {}'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public Boolean equals(Object o) { return true; } }'),
                    errors: [{ messageId: 'missingHashCode' }],
                },
            ],
        });
    });
});

describe('error/no-method-name-as-class', () => {
    it('runs', () => {
        tester.run('error-no-method-name-as-class', noMethodNameAsClass, {
            valid: [
                cls('public class Foo { public void bar() {} }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void Foo() {} }'),
                    errors: [{ messageId: 'methodNameAsClass' }],
                },
            ],
        });
    });
});

describe('error/test-methods-in-test-class', () => {
    it('runs', () => {
        tester.run('error-test-methods-in-test-class', testMethodsInTestClass, {
            valid: [
                cls('@isTest\npublic class T {\n  @isTest\n  static void t() {}\n}'),
            ],
            invalid: [
                {
                    ...cls('public class Foo {\n  @isTest\n  static void t() {}\n}'),
                    errors: [{ messageId: 'testMethodOutsideTestClass' }],
                },
            ],
        });
    });
});

describe('error/no-type-shadow-namespace', () => {
    it('runs', () => {
        tester.run('error-no-type-shadow-namespace', noTypeShadowNamespace, {
            valid: [
                cls('public class MyClass {}'),
            ],
            invalid: [
                {
                    ...cls('public class String {}'),
                    errors: [{ messageId: 'shadowsBuiltIn' }],
                },
            ],
        });
    });
});

// ── Performance ────────────────────────────────────────────────────────────

describe('perf/no-dml-in-loop', () => {
    it('runs', () => {
        tester.run('perf-no-dml-in-loop', noDmlInLoop, {
            valid: [
                cls('public class Foo { public void run() { insert new List<Account>(); } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { for (Integer i = 0; i < 10; i++) { insert new Account(); } } }'),
                    errors: [{ messageId: 'dmlInLoop' }],
                },
            ],
        });
    });
});

describe('perf/no-non-restrictive-query', () => {
    it('runs', () => {
        tester.run('perf-no-non-restrictive-query', noNonRestrictiveQuery, {
            valid: [
                cls('public class Foo { public void run() { List<Account> a = [SELECT Id FROM Account WHERE Name = \'Test\']; } }'),
            ],
            invalid: [
                {
                    ...cls('public class Foo { public void run() { List<Account> a = [SELECT Id FROM Account]; } }'),
                    errors: [{ messageId: 'noWhereClause' }],
                },
            ],
        });
    });
});

// ── Security ───────────────────────────────────────────────────────────────

describe('security/no-insecure-endpoint', () => {
    it('runs', () => {
        tester.run('security-no-insecure-endpoint', noInsecureEndpoint, {
            valid: [
                cls("public class Foo { public void run() { String e = 'https://api.example.com'; } }"),
            ],
            invalid: [
                {
                    ...cls("public class Foo { public void run() { String e = 'http://api.example.com'; } }"),
                    errors: [{ messageId: 'insecureEndpoint' }],
                },
            ],
        });
    });
});

describe('security/sharing-violations', () => {
    it('runs', () => {
        tester.run('security-sharing-violations', sharingViolations, {
            valid: [
                cls('public with sharing class Foo {}'),
                cls('@isTest\npublic class Foo {}'),
            ],
            invalid: [
                {
                    ...cls('public class Foo {}'),
                    errors: [{ messageId: 'noSharingDecl' }],
                },
            ],
        });
    });
});

describe('security/no-soql-injection', () => {
    it('runs', () => {
        tester.run('security-no-soql-injection', noSoqlInjection, {
            valid: [
                cls("public class Foo { public void run() { List<Account> a = Database.query('SELECT Id FROM Account'); } }"),
            ],
            invalid: [
                {
                    ...cls("public class Foo { public void run(String q) { List<Account> a = Database.query(q); } }"),
                    errors: [{ messageId: 'soqlInjection' }],
                },
            ],
        });
    });
});

console.log('All rule tests completed.');
