/**
 * Rule: error/no-method-name-as-class
 * PMD equivalent: MethodWithSameNameAsEnclosingClass
 *
 * Non-constructor methods should not share the name of their enclosing class.
 * In Apex, a method with the same name as its class but a return type is not
 * a constructor and causes confusion.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Non-constructor methods should not share the name of the enclosing class',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#methodwithsamenameasenclosingclass',
        },
        messages: {
            methodNameAsClass:
                "Method '{{method}}' has the same name as its enclosing class '{{class}}'. If this is a constructor, remove the return type. If it is a method, rename it.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexClassDeclaration(node) {
                const className = node.id.name.toLowerCase();
                for (const member of node.body || []) {
                    if (
                        member.type === 'ApexMethodDeclaration' &&
                        member.id.name.toLowerCase() === className
                    ) {
                        context.report({
                            node: member,
                            messageId: 'methodNameAsClass',
                            data: { method: member.id.name, class: node.id.name },
                        });
                    }
                }
            },
        };
    },
};
