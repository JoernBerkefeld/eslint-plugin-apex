/**
 * Rule: design/too-many-fields
 * PMD equivalent: TooManyFields
 *
 * Classes with an excessive number of fields are often doing too much.
 * Consider splitting them into smaller classes. Default threshold: 15.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Flag classes with too many fields',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#toomanyfields',
        },
        messages: {
            tooManyFields:
                "Class '{{name}}' has {{count}} fields (threshold: {{threshold}}). Consider refactoring.",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    minimum: { type: 'number', default: 15 },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const minimum = opts.minimum ?? 15;

        return {
            ApexClassDeclaration(node) {
                const count = (node.body || []).filter(
                    (m) => m.type === 'ApexFieldDeclaration'
                ).length;
                if (count > minimum) {
                    context.report({
                        node,
                        messageId: 'tooManyFields',
                        data: { name: node.id.name, count, threshold: minimum },
                    });
                }
            },
        };
    },
};
