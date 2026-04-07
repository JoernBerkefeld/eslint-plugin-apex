/**
 * Rule: design/cyclomatic-complexity
 * PMD equivalents: CyclomaticComplexity, StdCyclomaticComplexity
 *
 * Counts the number of independent paths through a method. Each decision point
 * (if, else if, for, while, do-while, catch, switch case, &&, ||, ?:)
 * adds 1 to the complexity. Default threshold: 10 per method, 40 per class.
 */

const DECISION_NODES = new Set([
    'ApexIfStatement',
    'ApexForStatement',
    'ApexForEachStatement',
    'ApexWhileStatement',
    'ApexDoWhileStatement',
    'ApexCatchClause',
    'ApexWhenClause',
    'ApexTernaryExpression',
]);

function countComplexity(stmts, depth) {
    if (!stmts) return 0;
    let count = 0;
    const list = Array.isArray(stmts) ? stmts : stmts.body || [];
    for (const stmt of list) {
        if (!stmt) continue;
        if (DECISION_NODES.has(stmt.type)) count++;
        if (stmt.type === 'ApexBinaryExpression') {
            const op = stmt.operator || '';
            if (op.includes('&&') || op.includes('||')) count++;
        }
        // Recurse
        if (stmt.body) count += countComplexity(stmt.body, depth + 1);
        if (stmt.block) count += countComplexity(stmt.block.body || [], depth + 1);
        if (stmt.consequent) count += countComplexity([stmt.consequent], depth + 1);
        if (stmt.alternate) count += countComplexity([stmt.alternate], depth + 1);
        if (stmt.handlers) {
            for (const h of stmt.handlers) {
                count++;
                count += countComplexity(h.block ? h.block.body || [] : [], depth + 1);
            }
        }
        if (stmt.cases) {
            for (const c of stmt.cases) {
                count += countComplexity(c.body ? c.body.body || [] : [], depth + 1);
            }
        }
    }
    return count;
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Limit cyclomatic complexity of methods and classes',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#cyclomaticcomplexity',
        },
        messages: {
            tooComplexMethod:
                "Method '{{name}}' has a cyclomatic complexity of {{complexity}} (threshold: {{threshold}}). Consider breaking it into smaller methods.",
            tooComplexClass:
                "Class '{{name}}' has a total cyclomatic complexity of {{complexity}} (threshold: {{threshold}}). Consider refactoring into multiple classes.",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    methodThreshold: { type: 'number', default: 10 },
                    classThreshold: { type: 'number', default: 40 },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const methodThreshold = opts.methodThreshold ?? 10;
        const classThreshold = opts.classThreshold ?? 40;

        return {
            ApexMethodDeclaration(node) {
                if (!node.body) return;
                const complexity = 1 + countComplexity(node.body.body || [], 0);
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
                        total += 1 + countComplexity(member.body.body || [], 0);
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
