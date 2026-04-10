/**
 * Rule: perf/no-debug-statements
 * PMD equivalent: AvoidDebugStatements
 *
 * System.debug() calls are always logged at FINEST in production unless
 * explicitly filtered. They consume CPU time and log space. Remove or gate
 * debug calls in production-bound code.
 *
 * Thematic overlap: `best-debug-use-logging-level` covers missing LoggingLevel on debug calls.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Remove or gate System.debug() calls in production code',
            recommended: false,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html',
        },
        messages: {
            debugStatement:
                'System.debug() is called. Remove debug statements from production code or gate them with custom labels.',
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodCallExpression(node) {
                const callee = (node.rawCallee || '').toLowerCase();
                if (callee === 'system.debug' || callee === 'debug') {
                    context.report({ node, messageId: 'debugStatement' });
                }
            },
        };
    },
};
