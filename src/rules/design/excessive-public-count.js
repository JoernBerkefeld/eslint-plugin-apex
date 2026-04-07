/**
 * Rule: design/excessive-public-count
 * PMD equivalent: ExcessivePublicCount
 *
 * Classes with too many public methods/attributes/properties suggest that the
 * class is doing too much and should be broken into smaller units.
 * Default threshold: 20.
 */

const PUBLIC_MODIFIERS = new Set(['public', 'global']);

function isPublic(modifiers) {
    return modifiers && modifiers.some((m) => PUBLIC_MODIFIERS.has(m.value));
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Flag classes with too many public methods or attributes',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#excessivepubliccount',
        },
        messages: {
            tooManyPublic:
                "Class '{{name}}' has {{count}} public members (threshold: {{threshold}}). Consider splitting into smaller, focused classes.",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    minimum: { type: 'number', default: 20 },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const minimum = opts.minimum ?? 20;

        return {
            ApexClassDeclaration(node) {
                let count = 0;
                for (const member of node.body || []) {
                    if (
                        (member.type === 'ApexMethodDeclaration' ||
                            member.type === 'ApexFieldDeclaration' ||
                            member.type === 'ApexPropertyDeclaration') &&
                        isPublic(member.modifiers)
                    ) {
                        count++;
                    }
                }
                if (count > minimum) {
                    context.report({
                        node,
                        messageId: 'tooManyPublic',
                        data: { name: node.id.name, count, threshold: minimum },
                    });
                }
            },
        };
    },
};
