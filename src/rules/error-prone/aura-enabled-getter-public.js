/**
 * Rule: error/aura-enabled-getter-public
 * PMD equivalent: InaccessibleAuraEnabledGetter
 *
 * Since Summer '21, @AuraEnabled properties with private or protected
 * getters are inaccessible from Lightning components. The getter must be
 * public or global.
 */

const PUBLIC_MODIFIERS = new Set(['public', 'global']);

export default {
    meta: {
        type: 'problem',
        docs: {
            description: '@AuraEnabled property getters must be public or global',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#inaccessibleauraenabledgetter',
        },
        messages: {
            inaccessibleGetter:
                "Property '{{name}}' has @AuraEnabled but its getter is not public or global. It will be inaccessible from Lightning components.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexPropertyDeclaration(node) {
                const hasAuraEnabled = (node.modifiers || []).some(
                    (m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'auraenabled',
                );
                if (!hasAuraEnabled) {
                    return;
                }

                const isPublic = (node.modifiers || []).some(
                    (m) => m.type === 'ApexModifierNode' && PUBLIC_MODIFIERS.has(m.value),
                );
                if (!isPublic) {
                    context.report({
                        node,
                        messageId: 'inaccessibleGetter',
                        data: { name: node.id.name },
                    });
                }
            },
        };
    },
};
