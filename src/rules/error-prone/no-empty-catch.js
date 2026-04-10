/**
 * Rule: error/no-empty-catch
 * PMD equivalent: EmptyCatchBlock
 *
 * Empty catch blocks swallow exceptions silently. At minimum, log the
 * exception. Optionally allow empty blocks containing comments, or blocks
 * catching exceptions whose variable name matches a configurable pattern.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow empty catch blocks',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#emptycatchblock',
        },
        messages: {
            emptyCatch: "Catch block for '{{type}}' is empty. Handle or log the exception.",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allowCommentedBlocks: { type: 'boolean', default: false },
                    allowExceptionNameRegex: { type: 'string', default: '^(ignored|expected)$' },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const allowCommented = opts.allowCommentedBlocks === true;
        const nameRegex = new RegExp(opts.allowExceptionNameRegex || '^(ignored|expected)$');

        return {
            ApexCatchClause(node) {
                // Check if catch block is empty
                const blockStmts = node.block ? node.block.body || [] : [];
                if (blockStmts.length > 0) {
                    return;
                }

                // Check exception name allowlist
                const paramName = (node.param || '').toLowerCase();
                if (nameRegex.test(paramName)) {
                    return;
                }

                // Check for commented blocks (heuristic: look at source range for /* or //)
                if (allowCommented && node.block && node.range) {
                    const src = context.sourceCode.getText();
                    const blockSrc = src.slice(node.block.range[0], node.block.range[1]);
                    if (blockSrc.includes('//') || blockSrc.includes('/*')) {
                        return;
                    }
                }

                context.report({
                    node,
                    messageId: 'emptyCatch',
                    data: { type: node.exceptionType || 'Exception' },
                });
            },
        };
    },
};
