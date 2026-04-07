/**
 * Rule: style/braces-for-for
 * PMD equivalent: ForLoopsMustUseBraces
 *
 * Require curly braces around for loop bodies.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Require braces around for loop bodies',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#forloopsmustusebraces',
        },
        messages: {
            missingBraces: 'For loop body should be wrapped in curly braces.',
        },
        schema: [],
    },

    create(context) {
        function checkBody(node) {
            if (node.body && node.body.type !== 'ApexBlockStatement') {
                context.report({ node, messageId: 'missingBraces' });
            }
        }

        return {
            ApexForStatement: checkBody,
            ApexForEachStatement: checkBody,
        };
    },
};
