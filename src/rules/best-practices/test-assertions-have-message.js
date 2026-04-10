/**
 * Rule: best/test-assertions-have-message
 * PMD equivalent: ApexAssertionsShouldIncludeMessage
 *
 * Calls to System.assert, System.assertEquals, and System.assertNotEquals should
 * include a message parameter to clarify what went wrong when the assertion fails.
 */

const ASSERT_METHODS = {
    'system.assert': { minArgs: 1, expectedArgs: 2 },
    'system.assertequals': { minArgs: 2, expectedArgs: 3 },
    'system.assertnotequals': { minArgs: 2, expectedArgs: 3 },
};

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'System.assert() calls should include a message parameter for clarity',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexassertionsshouldinc ludemessage',
        },
        messages: {
            missingMessage:
                "{{method}}() should include a message parameter. Example: {{method}}(condition, 'Expected X but got Y').",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodCallExpression(node) {
                const callee = (node.rawCallee || '').toLowerCase();
                const spec = ASSERT_METHODS[callee];
                if (!spec) {
                    return;
                }
                const args = node.arguments || [];
                if (args.length < spec.expectedArgs) {
                    context.report({
                        node,
                        messageId: 'missingMessage',
                        data: { method: callee.includes('.') ? callee : `System.${callee}` },
                    });
                }
            },
        };
    },
};
