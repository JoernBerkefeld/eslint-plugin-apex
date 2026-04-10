/**
 * Rule: best/no-future-annotation
 * PMD equivalent: AvoidFutureAnnotation
 *
 * The @Future annotation is limited to static methods, allows only primitive
 * or collection-of-primitives arguments, cannot be monitored easily, and
 * cannot be chained. Prefer implementing Queueable instead.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Prefer Queueable over @Future — the future annotation has significant limitations',
            recommended: false,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#avoidfutureannotation',
        },
        messages: {
            useFuture:
                "Method '{{name}}' uses @Future. Consider implementing the Queueable interface instead for better monitoring, chaining, and complex argument support.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodDeclaration(node) {
                if (!node.modifiers) {
                    return;
                }
                const hasFuture = node.modifiers.some(
                    (m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'future',
                );
                if (hasFuture) {
                    context.report({
                        node,
                        messageId: 'useFuture',
                        data: { name: node.id.name },
                    });
                }
            },
        };
    },
};
