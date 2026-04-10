/**
 * Rule: error/override-both-equals-hashcode
 * PMD equivalent: OverrideBothEqualsAndHashcode
 *
 * If a class overrides equals(), it must also override hashCode() and vice
 * versa. Inconsistency between the two breaks collections like Map and Set.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'If overriding equals(), also override hashCode(), and vice versa',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#overridebothequalsandhashcode',
        },
        messages: {
            missingHashCode:
                "Class '{{name}}' overrides equals() but not hashCode(). Add a hashCode() override.",
            missingEquals:
                "Class '{{name}}' overrides hashCode() but not equals(). Add an equals() override.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexClassDeclaration(node) {
                const methods = (node.body || [])
                    .filter((m) => m.type === 'ApexMethodDeclaration')
                    .map((m) => m.id.name.toLowerCase());

                const hasEquals = methods.includes('equals');
                const hasHashCode = methods.includes('hashcode');

                if (hasEquals && !hasHashCode) {
                    context.report({
                        node,
                        messageId: 'missingHashCode',
                        data: { name: node.id.name },
                    });
                } else if (hasHashCode && !hasEquals) {
                    context.report({
                        node,
                        messageId: 'missingEquals',
                        data: { name: node.id.name },
                    });
                }
            },
        };
    },
};
