/**
 * Rule: design/excessive-parameters
 * PMD equivalent: ExcessiveParameterList
 *
 * Methods with many parameters are hard to call, test, and refactor.
 * Consider using a parameter object or builder. Default threshold: 4.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Flag methods with too many parameters',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#excessiveparameterlist',
        },
        messages: {
            tooManyParams:
                "Method '{{name}}' has {{count}} parameters (threshold: {{threshold}}). Consider using a parameter object.",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    minimum: { type: 'number', default: 4 },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const minimum = opts.minimum ?? 4;

        return {
            ApexMethodDeclaration(node) {
                const count = (node.parameters || []).length;
                if (count > minimum) {
                    context.report({
                        node,
                        messageId: 'tooManyParams',
                        data: { name: node.id.name, count, threshold: minimum },
                    });
                }
            },
        };
    },
};
