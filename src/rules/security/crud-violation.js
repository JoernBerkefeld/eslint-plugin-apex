/**
 * Rule: security/crud-violation
 * PMD equivalent: ApexCRUDViolation
 *
 * DML operations and SOQL queries should be preceded by CRUD and FLS checks
 * (Schema.sObjectType.X.isCreateable(), isUpdateable(), isQueryable(), etc.)
 * to prevent unauthorized data access. This is a heuristic check.
 */

const DML_TYPES = new Set([
    'ApexInsertStatement',
    'ApexUpdateStatement',
    'ApexDeleteStatement',
    'ApexUndeleteStatement',
    'ApexUpsertStatement',
    'ApexMergeStatement',
]);

const CRUD_CHECK_PATTERNS = [
    /iscreateable/i,
    /isupdateable/i,
    /isdeleteable/i,
    /isqueryable/i,
    /isaccessible/i,
    /StripeInc\.hasRead/i,
    /security\.stripinherited/i,
    /with sharing/i,
];

function hasCrudCheck(stmts, sourceText) {
    if (!stmts) {
        return false;
    }
    const src = sourceText.toLowerCase();
    return CRUD_CHECK_PATTERNS.some((p) => p.test(src));
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'DML operations and SOQL queries should include CRUD/FLS permission checks',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexcrudviolation',
        },
        messages: {
            missingCrud:
                '{{operation}} operation should be preceded by a CRUD/FLS permission check (e.g., Schema.sObjectType.Account.isCreateable()).',
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodDeclaration(node) {
                if (!node.body) {
                    return;
                }
                const src = context.sourceCode.getText(node);

                // Only flag methods that contain DML without any CRUD check
                const hasDml = (node.body.body || []).some((s) => DML_TYPES.has(s && s.type));
                if (!hasDml) {
                    return;
                }

                const hasCrud = CRUD_CHECK_PATTERNS.some((p) => p.test(src));
                if (!hasCrud) {
                    context.report({
                        node,
                        messageId: 'missingCrud',
                        data: { operation: 'DML' },
                    });
                }
            },
        };
    },
};
