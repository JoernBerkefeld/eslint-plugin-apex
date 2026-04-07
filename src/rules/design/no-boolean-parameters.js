/**
 * Rule: design/no-boolean-parameters
 * PMD equivalent: AvoidBooleanMethodParameters
 *
 * Boolean parameters in public/global methods are a code smell. They
 * suggest the method does two different things. Prefer separate methods,
 * an enum, or a configuration object instead.
 */

const PUBLIC_MODIFIERS = new Set(['public', 'global']);

function isPublic(modifiers) {
    return modifiers && modifiers.some((m) => PUBLIC_MODIFIERS.has(m.value));
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Avoid boolean parameters in public and global methods',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#avoidbooleanmethodparameters',
        },
        messages: {
            booleanParam:
                "Method '{{method}}' has a boolean parameter '{{param}}'. Consider using an enum or separate methods instead.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodDeclaration(node) {
                if (!isPublic(node.modifiers)) return;
                for (const param of node.parameters || []) {
                    const typeName = (param.typeRef ? param.typeRef.name || '' : '').toLowerCase();
                    if (typeName === 'boolean') {
                        context.report({
                            node: param,
                            messageId: 'booleanParam',
                            data: { method: node.id.name, param: param.id.name },
                        });
                    }
                }
            },
        };
    },
};
