/**
 * Rule: design/cognitive-complexity
 * PMD equivalent: CognitiveComplexity
 *
 * Measures how difficult code is to understand. Unlike cyclomatic complexity,
 * nested structures increment by their nesting level, and some constructs
 * (like short-circuit operators) increment once regardless of repetition.
 * Default threshold: 15 per method, 50 per class.
 */

function countCognitive(stmts, nestingLevel) {
    if (!stmts) {
        return 0;
    }
    let count = 0;
    const list = Array.isArray(stmts) ? stmts : stmts.body || [];

    for (const stmt of list) {
        if (!stmt) {
            continue;
        }

        switch (stmt.type) {
            case 'ApexIfStatement':
            case 'ApexForStatement':
            case 'ApexForEachStatement':
            case 'ApexWhileStatement':
            case 'ApexDoWhileStatement':
            case 'ApexSwitchStatement':
            case 'ApexCatchClause': {
                count += 1 + nestingLevel;
                if (stmt.body) {
                    count += countCognitive(stmt.body, nestingLevel + 1);
                }
                if (stmt.block) {
                    count += countCognitive(stmt.block.body || [], nestingLevel + 1);
                }
                if (stmt.consequent) {
                    count += countCognitive([stmt.consequent], nestingLevel + 1);
                }
                if (stmt.alternate && stmt.alternate.type !== 'ApexIfStatement') {
                    count += 1; // else
                    count += countCognitive([stmt.alternate], nestingLevel + 1);
                } else if (stmt.alternate) {
                    count += countCognitive([stmt.alternate], nestingLevel); // else if doesn't add nesting
                }
                if (stmt.handlers) {
                    for (const h of stmt.handlers) {
                        count += countCognitive(
                            h.block ? h.block.body || [] : [],
                            nestingLevel + 1,
                        );
                    }
                }
                if (stmt.cases) {
                    for (const c of stmt.cases) {
                        count += countCognitive(c.body ? c.body.body || [] : [], nestingLevel + 1);
                    }
                }

                break;
            }
            case 'ApexTryStatement': {
                count += countCognitive(stmt.block ? stmt.block.body || [] : [], nestingLevel);
                if (stmt.handlers) {
                    for (const h of stmt.handlers) {
                        count += 1 + nestingLevel;
                        count += countCognitive(
                            h.block ? h.block.body || [] : [],
                            nestingLevel + 1,
                        );
                    }
                }

                break;
            }
            case 'ApexBinaryExpression': {
                const op = stmt.operator || '';
                if (op.includes('&&') || op.includes('||')) {
                    count += 1;
                }

                break;
            }
            default: {
                if (stmt.body) {
                    count += countCognitive(stmt.body, nestingLevel);
                }
                if (stmt.block) {
                    count += countCognitive(stmt.block.body || [], nestingLevel);
                }
            }
        }
    }
    return count;
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Limit cognitive complexity of methods and classes',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#cognitivecomplexity',
        },
        messages: {
            tooComplexMethod:
                "Method '{{name}}' has a cognitive complexity of {{complexity}} (threshold: {{threshold}}). Simplify by reducing nesting or extracting logic.",
            tooComplexClass:
                "Class '{{name}}' has a total cognitive complexity of {{complexity}} (threshold: {{threshold}}).",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    methodThreshold: { type: 'number', default: 15 },
                    classThreshold: { type: 'number', default: 50 },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const methodThreshold = opts.methodThreshold ?? 15;
        const classThreshold = opts.classThreshold ?? 50;

        return {
            ApexMethodDeclaration(node) {
                if (!node.body) {
                    return;
                }
                const complexity = countCognitive(node.body.body || [], 0);
                if (complexity > methodThreshold) {
                    context.report({
                        node,
                        messageId: 'tooComplexMethod',
                        data: { name: node.id.name, complexity, threshold: methodThreshold },
                    });
                }
            },
            ApexClassDeclaration(node) {
                let total = 0;
                for (const member of node.body || []) {
                    if (member.type === 'ApexMethodDeclaration' && member.body) {
                        total += countCognitive(member.body.body || [], 0);
                    }
                }
                if (total > classThreshold) {
                    context.report({
                        node,
                        messageId: 'tooComplexClass',
                        data: { name: node.id.name, complexity: total, threshold: classThreshold },
                    });
                }
            },
        };
    },
};
