/**
 * Rule: style/one-declaration-per-line
 * PMD equivalent: OneDeclarationPerLine
 *
 * Only one variable should be declared per statement. Multiple declarators
 * in a single statement make code harder to read and annotate individually.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Declare only one variable per statement',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#onedeclarationperline',
        },
        messages: {
            multipleDeclarators:
                'Declare only one variable per statement. Found {{count}} variables declared together.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    strictMode: { type: 'boolean', default: false },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        return {
            ApexLocalVariableDeclaration(node) {
                if ((node.declarators || []).length > 1) {
                    context.report({
                        node,
                        messageId: 'multipleDeclarators',
                        data: { count: node.declarators.length },
                    });
                }
            },
            ApexFieldDeclaration(node) {
                if ((node.declarators || []).length > 1) {
                    context.report({
                        node,
                        messageId: 'multipleDeclarators',
                        data: { count: node.declarators.length },
                    });
                }
            },
        };
    },
};
