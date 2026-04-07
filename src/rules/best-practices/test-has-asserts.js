/**
 * Rule: best/test-has-asserts
 * PMD equivalent: ApexUnitTestClassShouldHaveAsserts
 *
 * Apex unit test classes should include at least one assertion.
 */

const DEFAULT_ASSERT_PATTERNS = [
    /^system\.assert$/i,
    /^system\.assertequals$/i,
    /^system\.assertnotequals$/i,
];

function isTestClass(node) {
    return node.modifiers && node.modifiers.some(
        (m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'istest'
    );
}

function isTestMethod(node) {
    return (
        node.modifiers &&
        (node.modifiers.some(
            (m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'istest'
        ) ||
            node.modifiers.some((m) => m.value === 'testmethod'))
    );
}

function containsAssertCall(body, patterns) {
    if (!body) return false;
    const stmts = Array.isArray(body) ? body : body.body || [];
    for (const stmt of stmts) {
        if (!stmt) continue;
        if (stmt.type === 'ApexExpressionStatement' && stmt.expression) {
            const expr = stmt.expression;
            if (expr.type === 'ApexMethodCallExpression') {
                const callee = expr.rawCallee || '';
                if (patterns.some((p) => p.test(callee))) return true;
            }
        }
        // Recurse into blocks
        if (stmt.body) {
            if (containsAssertCall(stmt.body, patterns)) return true;
        }
        if (stmt.block) {
            if (containsAssertCall(stmt.block.body || [], patterns)) return true;
        }
        if (stmt.consequent) {
            if (containsAssertCall(stmt.consequent, patterns)) return true;
        }
        if (stmt.alternate) {
            if (containsAssertCall(stmt.alternate, patterns)) return true;
        }
        if (stmt.handlers) {
            for (const h of stmt.handlers) {
                if (containsAssertCall(h.block ? h.block.body || [] : [], patterns)) return true;
            }
        }
    }
    return false;
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Apex unit test classes should include at least one assertion',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexunittestclassshouldhaveasserts',
        },
        messages: {
            missingAssert:
                "Test method '{{name}}' does not contain any System.assert() calls. Add assertions to verify expected behavior.",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    additionalAssertMethodPattern: { type: 'string' },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {};
        const patterns = [...DEFAULT_ASSERT_PATTERNS];
        if (options.additionalAssertMethodPattern) {
            patterns.push(new RegExp(options.additionalAssertMethodPattern, 'i'));
        }

        return {
            ApexClassDeclaration(node) {
                if (!isTestClass(node)) return;
                for (const member of node.body || []) {
                    if (member.type === 'ApexMethodDeclaration' && isTestMethod(member)) {
                        if (!containsAssertCall(member.body ? member.body.body || [] : [], patterns)) {
                            context.report({
                                node: member,
                                messageId: 'missingAssert',
                                data: { name: member.id.name },
                            });
                        }
                    }
                }
            },
        };
    },
};
