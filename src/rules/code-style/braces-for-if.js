/**
 * Rule: style/braces-for-if
 * PMD equivalents: IfStmtsMustUseBraces, IfElseStmtsMustUseBraces
 *
 * Require curly braces around if/else statement bodies.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Require braces around if/else statement bodies',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#ifstmtsmustusebraces',
        },
        messages: {
            missingBraces: "{{kind}} statement body should be wrapped in curly braces '{}'.",
        },
        schema: [],
    },

    create(context) {
        function isBlock(stmt) {
            return stmt && stmt.type === 'ApexBlockStatement';
        }

        return {
            ApexIfStatement(node) {
                if (node.consequent && !isBlock(node.consequent)) {
                    context.report({ node, messageId: 'missingBraces', data: { kind: 'if' } });
                }
                if (node.alternate && !isBlock(node.alternate) && node.alternate.type !== 'ApexIfStatement') {
                    context.report({ node: node.alternate, messageId: 'missingBraces', data: { kind: 'else' } });
                }
            },
        };
    },
};
