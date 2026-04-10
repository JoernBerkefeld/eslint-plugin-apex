/**
 * Tests for the Apex ESLint parser adapter.
 *
 * Verifies that parseForESLint() returns a valid ESLint AST structure
 * with correct node types, ranges, locations, and visitor keys.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseForESLint } from '../src/apex-parser.js';
import { VISITOR_KEYS } from '../src/node-types.js';

// ── Helpers ────────────────────────────────────────────────────────────────

function parse(code, filePath = 'Test.cls') {
    return parseForESLint(code, { filePath });
}

function assertNode(node, expectedType) {
    assert.ok(node, `Expected node of type ${expectedType}`);
    assert.strictEqual(node.type, expectedType, `Expected type ${expectedType}, got ${node.type}`);
    assert.ok(Array.isArray(node.range), `Node ${expectedType} should have range array`);
    assert.strictEqual(node.range.length, 2, `range should have 2 elements`);
    assert.ok(node.loc, `Node ${expectedType} should have loc`);
    assert.ok(node.loc.start, `Node ${expectedType}.loc should have start`);
    assert.ok(node.loc.end, `Node ${expectedType}.loc should have end`);
}

// ── Parser interface tests ─────────────────────────────────────────────────

describe('parseForESLint', () => {
    it('returns the required ESLint result shape', () => {
        const result = parse('public class Foo {}');
        assert.ok(result.ast, 'result should have ast');
        assert.ok(result.visitorKeys, 'result should have visitorKeys');
        assert.ok(result.services, 'result should have services');
        assert.strictEqual(result.scopeManager, null);
    });

    it('returns VISITOR_KEYS', () => {
        const result = parse('public class Foo {}');
        assert.deepStrictEqual(result.visitorKeys, VISITOR_KEYS);
    });

    it('parses an empty class file without errors', () => {
        const result = parse('public class Foo {}');
        assert.strictEqual(result.ast.type, 'Program');
        assert.strictEqual(result.services.parseErrors.length, 0);
    });

    it('produces a Program node with correct range', () => {
        const code = 'public class Foo {}';
        const result = parse(code);
        assertNode(result.ast, 'Program');
        assert.strictEqual(result.ast.range[0], 0);
        assert.strictEqual(result.ast.range[1], code.length);
    });
});

// ── Class declaration tests ────────────────────────────────────────────────

describe('ApexClassDeclaration', () => {
    it('detects class name and modifiers', () => {
        const result = parse('public class MyClass {}');
        const cls = result.ast.body[0];
        assertNode(cls, 'ApexClassDeclaration');
        assert.strictEqual(cls.id.name, 'MyClass');
        assert.ok(cls.modifiers.length > 0, 'should have modifiers');
        assert.ok(cls.modifiers.some((m) => m.value === 'public'));
    });

    it('detects class with @IsTest annotation', () => {
        const result = parse('@isTest\npublic class MyTest {}');
        const cls = result.ast.body[0];
        assert.ok(
            cls.modifiers.some(
                (m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'istest',
            ),
        );
    });

    it('detects class with superclass', () => {
        const result = parse('public class Child extends Parent {}');
        const cls = result.ast.body[0];
        assert.ok(cls.superClass, 'should have superClass');
        assert.strictEqual(cls.superClass, 'Parent');
    });

    it('detects class implementing interfaces', () => {
        const result = parse('public class Foo implements Queueable, Database.AllowsCallouts {}');
        const cls = result.ast.body[0];
        assert.ok(cls.interfaces.length > 0, 'should have interfaces');
    });

    it('detects method declarations within a class', () => {
        const result = parse('public class Foo { public void bar() {} }');
        const cls = result.ast.body[0];
        const methods = cls.body.filter((m) => m.type === 'ApexMethodDeclaration');
        assert.ok(methods.length > 0, 'should have methods');
        assert.strictEqual(methods[0].id.name, 'bar');
    });

    it('detects field declarations within a class', () => {
        const result = parse('public class Foo { private String name; }');
        const cls = result.ast.body[0];
        const fields = cls.body.filter((m) => m.type === 'ApexFieldDeclaration');
        assert.ok(fields.length > 0, 'should have fields');
    });
});

// ── Method declaration tests ───────────────────────────────────────────────

describe('ApexMethodDeclaration', () => {
    it('detects return type and parameters', () => {
        const result = parse(
            'public class Foo { public String greet(String name, Integer count) { return name; } }',
        );
        const cls = result.ast.body[0];
        const method = cls.body.find((m) => m.type === 'ApexMethodDeclaration');
        assert.ok(method, 'should find method');
        assert.strictEqual(method.id.name, 'greet');
        assert.strictEqual(method.parameters.length, 2);
        assert.strictEqual(method.parameters[0].id.name, 'name');
        assert.strictEqual(method.parameters[1].id.name, 'count');
    });

    it('detects method body statements', () => {
        const result = parse('public class Foo { public void doIt() { Integer x = 1; } }');
        const cls = result.ast.body[0];
        const method = cls.body.find((m) => m.type === 'ApexMethodDeclaration');
        assert.ok(method.body, 'method should have body');
        assert.ok(method.body.body.length > 0, 'body should have statements');
    });
});

// ── Trigger declaration tests ──────────────────────────────────────────────

describe('ApexTriggerDeclaration', () => {
    it('parses a trigger file', () => {
        const result = parseForESLint(
            'trigger AccountTrigger on Account (before insert, after update) {}',
            { filePath: 'AccountTrigger.trigger' },
        );
        const trigger = result.ast.body[0];
        assertNode(trigger, 'ApexTriggerDeclaration');
        assert.strictEqual(trigger.id.name, 'AccountTrigger');
        assert.strictEqual(trigger.object, 'Account');
        assert.ok(trigger.events.length >= 2, 'should have trigger events');
    });
});

// ── Statement tests ────────────────────────────────────────────────────────

describe('Statements', () => {
    function getMethodBody(code) {
        const result = parse(`public class Foo { public void run() { ${code} } }`);
        const cls = result.ast.body[0];
        const method = cls.body.find((m) => m.type === 'ApexMethodDeclaration');
        return method.body.body;
    }

    it('parses if statement', () => {
        const stmts = getMethodBody('if (true) {}');
        assert.ok(stmts.some((s) => s && s.type === 'ApexIfStatement'));
    });

    it('parses for-each loop', () => {
        const stmts = getMethodBody('for (Account a : new List<Account>()) {}');
        assert.ok(
            stmts.some(
                (s) => s && (s.type === 'ApexForStatement' || s.type === 'ApexForEachStatement'),
            ),
        );
    });

    it('parses try-catch', () => {
        const stmts = getMethodBody('try { } catch (Exception e) {}');
        assert.ok(stmts.some((s) => s && s.type === 'ApexTryStatement'));
    });

    it('parses local variable declaration', () => {
        const stmts = getMethodBody('Integer x = 42;');
        assert.ok(stmts.some((s) => s && s.type === 'ApexLocalVariableDeclaration'));
    });

    it('parses return statement', () => {
        const stmts = getMethodBody('return null;');
        assert.ok(stmts.some((s) => s && s.type === 'ApexReturnStatement'));
    });
});

// ── SOQL expression tests ──────────────────────────────────────────────────

describe('SOQL expressions', () => {
    it('parses inline SOQL', () => {
        const result = parse(
            'public class Foo { public void q() { List<Account> a = [SELECT Id FROM Account]; } }',
        );
        const cls = result.ast.body[0];
        const method = cls.body.find((m) => m.type === 'ApexMethodDeclaration');
        // SOQL may appear in variable init or expression
        assert.ok(method.body.body.length > 0);
    });
});
