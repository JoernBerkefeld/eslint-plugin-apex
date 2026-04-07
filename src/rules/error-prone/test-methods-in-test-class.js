/**
 * Rule: error/test-methods-in-test-class
 * PMD equivalent: TestMethodsMustBeInTestClasses
 *
 * @IsTest methods and methods with the testMethod modifier must reside in
 * classes annotated with @IsTest. Since API v27.0 this is a compile requirement.
 */

function isTestClass(modifiers) {
    return modifiers && modifiers.some(
        (m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'istest'
    );
}

function isTestMethod(modifiers) {
    return (
        modifiers &&
        (modifiers.some(
            (m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'istest'
        ) ||
            modifiers.some((m) => m.value === 'testmethod'))
    );
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description: '@IsTest methods must reside in @IsTest annotated classes',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#testmethodsmustbeintestclasses',
        },
        messages: {
            testMethodOutsideTestClass:
                "Method '{{name}}' is a test method but class '{{class}}' is not annotated with @IsTest.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexClassDeclaration(node) {
                if (isTestClass(node.modifiers)) return;
                for (const member of node.body || []) {
                    if (
                        member.type === 'ApexMethodDeclaration' &&
                        isTestMethod(member.modifiers)
                    ) {
                        context.report({
                            node: member,
                            messageId: 'testMethodOutsideTestClass',
                            data: { name: member.id.name, class: node.id.name },
                        });
                    }
                }
            },
        };
    },
};
