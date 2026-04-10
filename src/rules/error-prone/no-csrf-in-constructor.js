/**
 * Rule: error/no-csrf-in-constructor
 * PMD equivalent: ApexCSRF
 *
 * DML operations (INSERT, UPDATE, DELETE, etc.) in constructors or
 * initialization blocks cause runtime exceptions when the page is loaded.
 * They are also a CSRF vulnerability pattern.
 */

const DML_TYPES = new Set([
    'ApexInsertStatement',
    'ApexUpdateStatement',
    'ApexDeleteStatement',
    'ApexUndeleteStatement',
    'ApexUpsertStatement',
    'ApexMergeStatement',
]);

function containsDml(stmts) {
    if (!stmts) {
        return false;
    }
    const list = Array.isArray(stmts) ? stmts : stmts.body || [];
    for (const stmt of list) {
        if (!stmt) {
            continue;
        }
        if (DML_TYPES.has(stmt.type)) {
            return true;
        }
        if (stmt.body && containsDml(stmt.body)) {
            return true;
        }
        if (stmt.block && containsDml(stmt.block.body || [])) {
            return true;
        }
        if (stmt.consequent && containsDml([stmt.consequent])) {
            return true;
        }
        if (stmt.alternate && containsDml([stmt.alternate])) {
            return true;
        }
    }
    return false;
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow DML operations in constructors or class initializers',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#apexcsrf',
        },
        messages: {
            dmlInConstructor:
                "Constructor '{{name}}' contains a DML operation. DML in constructors can cause CSRF and runtime exceptions.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexConstructorDeclaration(node) {
                if (node.body && containsDml(node.body.body || [])) {
                    context.report({
                        node,
                        messageId: 'dmlInConstructor',
                        data: { name: node.id.name },
                    });
                }
            },
        };
    },
};
