/**
 * Rule: best/no-unused-local-variable
 * PMD equivalent: UnusedLocalVariable
 *
 * Detects local variables that are declared (and optionally assigned) but
 * never read after their declaration. This is a lightweight heuristic check
 * based on variable name occurrence counting within the enclosing method body.
 */

function collectVarUsage(stmts, declared, used) {
    if (!stmts) return;
    const list = Array.isArray(stmts) ? stmts : stmts.body || [];
    for (const stmt of list) {
        if (!stmt) continue;
        if (stmt.type === 'ApexLocalVariableDeclaration') {
            for (const d of stmt.declarators || []) {
                declared.set(d.id.name, { node: d, count: 0 });
                if (d.init) collectExprUsage(d.init, declared, used);
            }
        } else {
            collectStmtUsage(stmt, declared, used);
        }
    }
}

function collectStmtUsage(stmt, declared, used) {
    if (!stmt) return;
    if (stmt.expression) collectExprUsage(stmt.expression, declared, used);
    if (stmt.condition) collectExprUsage(stmt.condition, declared, used);
    if (stmt.argument) collectExprUsage(stmt.argument, declared, used);
    if (stmt.body) collectVarUsage(stmt.body, declared, used);
    if (stmt.block) collectVarUsage(stmt.block, declared, used);
    if (stmt.consequent) collectStmtUsage(stmt.consequent, declared, used);
    if (stmt.alternate) collectStmtUsage(stmt.alternate, declared, used);
    if (stmt.handlers) {
        for (const h of stmt.handlers) {
            collectVarUsage(h.block ? h.block.body || [] : [], declared, used);
        }
    }
    if (stmt.finalizer) collectVarUsage(stmt.finalizer.block ? stmt.finalizer.block.body || [] : [], declared, used);
    if (stmt.cases) {
        for (const c of stmt.cases) {
            collectVarUsage(c.body ? c.body.body || [] : [], declared, used);
        }
    }
}

function collectExprUsage(expr, declared, used) {
    if (!expr) return;
    if (expr.type === 'ApexVariableExpression' || expr.type === 'Identifier') {
        const name = expr.name || expr.rawName;
        if (name && declared.has(name)) {
            const entry = declared.get(name);
            entry.count++;
        }
    }
    if (expr.left) collectExprUsage(expr.left, declared, used);
    if (expr.right) collectExprUsage(expr.right, declared, used);
    if (expr.object) collectExprUsage(expr.object, declared, used);
    if (expr.callee) collectExprUsage(expr.callee, declared, used);
    if (expr.arguments) expr.arguments.forEach((a) => collectExprUsage(a, declared, used));
    if (expr.argument) collectExprUsage(expr.argument, declared, used);
    if (expr.index) collectExprUsage(expr.index, declared, used);
    if (expr.init) collectExprUsage(expr.init, declared, used);
    if (expr.condition) collectExprUsage(expr.condition, declared, used);
    if (expr.consequent) collectExprUsage(expr.consequent, declared, used);
    if (expr.alternate) collectExprUsage(expr.alternate, declared, used);
    if (expr.expression) collectExprUsage(expr.expression, declared, used);
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Detects local variables that are declared but never read',
            recommended: false,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#unusedlocalvariable',
        },
        messages: {
            unusedVariable:
                "Local variable '{{name}}' is declared but never used.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodDeclaration(node) {
                if (!node.body) return;
                const declared = new Map();
                const used = new Set();
                collectVarUsage(node.body.body || [], declared, used);
                for (const [name, entry] of declared) {
                    if (entry.count === 0) {
                        context.report({
                            node: entry.node,
                            messageId: 'unusedVariable',
                            data: { name },
                        });
                    }
                }
            },
        };
    },
};
