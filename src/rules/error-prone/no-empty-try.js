/**
 * Rule: error/no-empty-try
 * PMD equivalent: EmptyTryOrFinallyBlock
 *
 * Empty try or finally blocks provide no protection and are likely mistakes.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow empty try or finally blocks',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#emptytryorfinallyblock',
        },
        messages: {
            emptyTry: 'try block is empty. Add code that may throw exceptions.',
            emptyFinally: 'finally block is empty. Add cleanup code or remove the finally block.',
        },
        schema: [],
    },

    create(context) {
        return {
            ApexTryStatement(node) {
                if (node.block && (node.block.body || []).length === 0) {
                    context.report({ node, messageId: 'emptyTry' });
                }
                if (node.finalizer && node.finalizer.block && (node.finalizer.block.body || []).length === 0) {
                    context.report({ node: node.finalizer, messageId: 'emptyFinally' });
                }
            },
        };
    },
};
