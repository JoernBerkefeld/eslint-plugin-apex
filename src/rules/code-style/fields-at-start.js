/**
 * Rule: style/fields-at-start
 * PMD equivalent: FieldDeclarationsShouldBeAtStart
 *
 * Field declarations should appear before method declarations within a class body.
 * This makes the class structure more predictable and readable.
 */

const METHOD_TYPES = new Set(['ApexMethodDeclaration', 'ApexConstructorDeclaration']);

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Field declarations should appear before method declarations',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#fielddeclarationsshouldbeat start',
        },
        messages: {
            fieldAfterMethod:
                "Field '{{name}}' is declared after a method. Move field declarations to the top of the class body.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexClassDeclaration(node) {
                let seenMethod = false;
                for (const member of node.body || []) {
                    if (METHOD_TYPES.has(member.type)) {
                        seenMethod = true;
                    } else if (member.type === 'ApexFieldDeclaration' && seenMethod) {
                        for (const d of member.declarators || []) {
                            context.report({
                                node: member,
                                messageId: 'fieldAfterMethod',
                                data: { name: d.id.name },
                            });
                        }
                    }
                }
            },
        };
    },
};
