/**
 * Rule: best/test-method-annotation
 * PMD equivalent: ApexUnitTestMethodShouldHaveIsTestAnnotation
 *
 * Test methods should use the @IsTest annotation rather than the deprecated
 * `testMethod` keyword modifier.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: "Use @IsTest annotation instead of the deprecated 'testMethod' keyword",
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexunittestmethodshouldhaveistestannotation',
        },
        messages: {
            useAnnotation:
                "Method '{{name}}' uses the deprecated 'testMethod' modifier. Replace with @IsTest annotation.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodDeclaration(node) {
                if (!node.modifiers) return;
                const hasTestMethod = node.modifiers.some(
                    (m) => m.type === 'ApexModifierNode' && m.value === 'testmethod'
                );
                if (hasTestMethod) {
                    context.report({
                        node,
                        messageId: 'useAnnotation',
                        data: { name: node.id.name },
                    });
                }
            },
        };
    },
};
