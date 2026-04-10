/**
 * Rule: design/ncss-method-count
 * PMD equivalents: NcssMethodCount, NcssCount, NcssTypeCount
 *
 * Non-Commenting Source Statements (NCSS) is a measure of the number of
 * executable statements excluding comments and blank lines.
 * Default thresholds: method=40, class=500.
 */

function countNcss(stmts) {
    if (!stmts) {
        return 0;
    }
    let count = 0;
    const list = Array.isArray(stmts) ? stmts : stmts.body || [];

    for (const stmt of list) {
        if (!stmt) {
            continue;
        }
        // Count most statement types as 1 NCSS each
        switch (stmt.type) {
            case 'ApexLocalVariableDeclaration':
            case 'ApexExpressionStatement':
            case 'ApexReturnStatement':
            case 'ApexThrowStatement':
            case 'ApexBreakStatement':
            case 'ApexContinueStatement':
            case 'ApexInsertStatement':
            case 'ApexUpdateStatement':
            case 'ApexDeleteStatement':
            case 'ApexUndeleteStatement':
            case 'ApexUpsertStatement':
            case 'ApexMergeStatement': {
                count += 1;

                break;
            }
            case 'ApexIfStatement':
            case 'ApexForStatement':
            case 'ApexForEachStatement':
            case 'ApexWhileStatement':
            case 'ApexDoWhileStatement':
            case 'ApexSwitchStatement': {
                count += 1;
                if (stmt.body) {
                    count += countNcss(stmt.body);
                }
                if (stmt.block) {
                    count += countNcss(stmt.block.body || []);
                }
                if (stmt.consequent) {
                    count += countNcss([stmt.consequent]);
                }
                if (stmt.alternate) {
                    count += countNcss([stmt.alternate]);
                }
                if (stmt.cases) {
                    for (const c of stmt.cases) {
                        count += countNcss(c.body ? c.body.body || [] : []);
                    }
                }

                break;
            }
            case 'ApexTryStatement': {
                count += 1;
                count += countNcss(stmt.block ? stmt.block.body || [] : []);
                if (stmt.handlers) {
                    for (const h of stmt.handlers) {
                        count += 1;
                        count += countNcss(h.block ? h.block.body || [] : []);
                    }
                }
                if (stmt.finalizer) {
                    count += countNcss(stmt.finalizer.block ? stmt.finalizer.block.body || [] : []);
                }

                break;
            }
            // No default
        }
    }
    return count;
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Limit the number of non-commenting source statements per method and class',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#ncsscount',
        },
        messages: {
            tooLongMethod:
                "Method '{{name}}' has {{count}} NCSS statements (threshold: {{threshold}}). Consider breaking it into smaller methods.",
            tooLongClass:
                "Class '{{name}}' has {{count}} NCSS statements (threshold: {{threshold}}). Consider splitting it.",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    methodReportLevel: { type: 'number', default: 40 },
                    classReportLevel: { type: 'number', default: 500 },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const methodThreshold = opts.methodReportLevel ?? 40;
        const classThreshold = opts.classReportLevel ?? 500;

        return {
            ApexMethodDeclaration(node) {
                if (!node.body) {
                    return;
                }
                const count = countNcss(node.body.body || []);
                if (count > methodThreshold) {
                    context.report({
                        node,
                        messageId: 'tooLongMethod',
                        data: { name: node.id.name, count, threshold: methodThreshold },
                    });
                }
            },
            ApexClassDeclaration(node) {
                let total = 0;
                for (const member of node.body || []) {
                    if (member.type === 'ApexMethodDeclaration' && member.body) {
                        total += countNcss(member.body.body || []);
                    } else if (member.type === 'ApexConstructorDeclaration' && member.body) {
                        total += countNcss(member.body.body || []);
                    }
                }
                if (total > classThreshold) {
                    context.report({
                        node,
                        messageId: 'tooLongClass',
                        data: { name: node.id.name, count: total, threshold: classThreshold },
                    });
                }
            },
        };
    },
};
