/**
 * Rule: design/no-unused-method
 * PMD equivalent: UnusedMethod
 *
 * Detects private methods that are declared but never called within the same
 * class. Note: This is a heuristic check. It only tracks calls within the
 * same class body and cannot detect reflection-based calls.
 */

function collectMethodCalls(stmts, calledNames) {
    if (!stmts) {
        return;
    }
    const list = Array.isArray(stmts) ? stmts : stmts.body || [];
    for (const stmt of list) {
        if (!stmt) {
            continue;
        }
        collectExprCalls(stmt.expression, calledNames);
        collectExprCalls(stmt.condition, calledNames);
        collectExprCalls(stmt.argument, calledNames);
        if (stmt.body) {
            collectMethodCalls(stmt.body, calledNames);
        }
        if (stmt.block) {
            collectMethodCalls(stmt.block.body || [], calledNames);
        }
        if (stmt.consequent) {
            collectMethodCalls([stmt.consequent], calledNames);
        }
        if (stmt.alternate) {
            collectMethodCalls([stmt.alternate], calledNames);
        }
        if (stmt.handlers) {
            for (const h of stmt.handlers) {
                collectMethodCalls(h.block ? h.block.body || [] : [], calledNames);
            }
        }
        if (stmt.declarators) {
            for (const d of stmt.declarators) {
                collectExprCalls(d.init, calledNames);
            }
        }
    }
}

function collectExprCalls(expr, calledNames) {
    if (!expr) {
        return;
    }
    if (expr.type === 'ApexMethodCallExpression') {
        const name = expr.methodName || (expr.rawCallee || '').split('.').pop();
        if (name) {
            calledNames.add(name.toLowerCase());
        }
        for (const arg of expr.arguments || []) {
            collectExprCalls(arg, calledNames);
        }
        collectExprCalls(expr.callee, calledNames);
    }
    if (expr.left) {
        collectExprCalls(expr.left, calledNames);
    }
    if (expr.right) {
        collectExprCalls(expr.right, calledNames);
    }
    if (expr.object) {
        collectExprCalls(expr.object, calledNames);
    }
    if (expr.argument) {
        collectExprCalls(expr.argument, calledNames);
    }
    if (expr.condition) {
        collectExprCalls(expr.condition, calledNames);
    }
    if (expr.consequent) {
        collectExprCalls(expr.consequent, calledNames);
    }
    if (expr.alternate) {
        collectExprCalls(expr.alternate, calledNames);
    }
    if (expr.init) {
        collectExprCalls(expr.init, calledNames);
    }
    if (expr.index) {
        collectExprCalls(expr.index, calledNames);
    }
}

function isPrivate(modifiers) {
    return modifiers && modifiers.some((m) => m.value === 'private');
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Detect private methods that are never called within the class',
            recommended: false,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#unusedmethod',
        },
        messages: {
            unusedMethod:
                "Method '{{name}}' is private but appears to be unused. Remove it or make it accessible.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexClassDeclaration(node) {
                const methods = (node.body || []).filter(
                    (m) => m.type === 'ApexMethodDeclaration' && isPrivate(m.modifiers),
                );

                if (methods.length === 0) {
                    return;
                }

                // Collect all method calls in the class
                const calledNames = new Set();
                for (const member of node.body || []) {
                    if (
                        member.type === 'ApexMethodDeclaration' ||
                        member.type === 'ApexConstructorDeclaration'
                    ) {
                        collectMethodCalls(member.body ? member.body.body || [] : [], calledNames);
                    }
                }

                for (const method of methods) {
                    const name = method.id.name.toLowerCase();
                    if (!calledNames.has(name)) {
                        context.report({
                            node: method,
                            messageId: 'unusedMethod',
                            data: { name: method.id.name },
                        });
                    }
                }
            },
        };
    },
};
