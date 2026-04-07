/**
 * Rule: best/no-global-modifier
 * PMD equivalent: AvoidGlobalModifier
 *
 * Classes declared as `global` (especially in managed packages) can never be
 * deleted and their public signatures become locked. Prefer `public` unless the
 * class must be accessible from an unmanaged namespace.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: "Avoid 'global' class modifier — it permanently locks the public API in managed packages",
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#avoidglobalmodifier',
        },
        messages: {
            globalModifier:
                "'{{name}}' is declared global. Prefer public unless cross-namespace access is required, as global declarations in managed packages can never be removed.",
        },
        schema: [],
    },

    create(context) {
        function checkGlobal(node, name) {
            if (!node.modifiers) return;
            const hasGlobal = node.modifiers.some(
                (m) => m.type === 'ApexModifierNode' && m.value === 'global'
            );
            if (hasGlobal) {
                context.report({ node, messageId: 'globalModifier', data: { name } });
            }
        }

        return {
            ApexClassDeclaration(node) {
                checkGlobal(node, node.id.name);
            },
            ApexMethodDeclaration(node) {
                checkGlobal(node, node.id.name);
            },
        };
    },
};
