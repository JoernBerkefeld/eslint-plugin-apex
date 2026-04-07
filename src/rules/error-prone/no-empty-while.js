/**
 * Rule: error/no-empty-while
 * PMD equivalent: EmptyWhileStmt
 *
 * A while loop with an empty body is almost certainly a bug — the loop will
 * spin forever or immediately exit without doing anything useful.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow empty while loop bodies',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#emptywhilestmt',
        },
        messages: {
            emptyWhile: 'while loop has an empty body. Add meaningful logic or remove the loop.',
        },
        schema: [],
    },

    create(context) {
        return {
            ApexWhileStatement(node) {
                if (
                    node.body &&
                    node.body.type === 'ApexBlockStatement' &&
                    (node.body.body || []).length === 0
                ) {
                    context.report({ node, messageId: 'emptyWhile' });
                }
            },
        };
    },
};
