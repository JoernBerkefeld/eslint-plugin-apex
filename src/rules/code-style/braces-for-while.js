/**
 * Rule: style/braces-for-while
 * PMD equivalent: WhileLoopsMustUseBraces
 *
 * Require curly braces around while loop bodies.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Require braces around while loop bodies',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#whileloopsmustusebraces',
        },
        messages: {
            missingBraces: 'While loop body should be wrapped in curly braces.',
        },
        schema: [],
    },

    create(context) {
        return {
            ApexWhileStatement(node) {
                if (node.body && node.body.type !== 'ApexBlockStatement') {
                    context.report({ node, messageId: 'missingBraces' });
                }
            },
        };
    },
};
