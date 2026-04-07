/**
 * Rule: error/no-empty-if
 * PMD equivalent: EmptyIfStmt
 *
 * An if statement with an empty body is likely a mistake or dead code.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow empty if statement bodies',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#emptyifstmt',
        },
        messages: {
            emptyIf: 'if statement has an empty body. Remove it or add meaningful logic.',
        },
        schema: [],
    },

    create(context) {
        return {
            ApexIfStatement(node) {
                if (
                    node.consequent &&
                    node.consequent.type === 'ApexBlockStatement' &&
                    (node.consequent.body || []).length === 0
                ) {
                    context.report({ node, messageId: 'emptyIf' });
                }
            },
        };
    },
};
