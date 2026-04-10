/**
 * Rule: best/queueable-needs-finalizer
 * PMD equivalent: QueueableWithoutFinalizer
 *
 * Classes implementing Queueable should also attach a Finalizer via
 * System.attachFinalizer() in their execute() method to handle failures
 * gracefully in production.
 */

function implementsQueueable(interfaces) {
    return (interfaces || []).some((i) => i.toLowerCase() === 'queueable');
}

function containsAttachFinalizer(stmts) {
    if (!stmts) {
        return false;
    }
    for (const stmt of stmts) {
        if (!stmt) {
            continue;
        }
        if (
            stmt.type === 'ApexExpressionStatement' &&
            stmt.expression &&
            stmt.expression.type === 'ApexMethodCallExpression'
        ) {
            const callee = (stmt.expression.rawCallee || '').toLowerCase();
            if (callee === 'system.attachfinalizer' || callee === 'attachfinalizer') {
                return true;
            }
        }
        if (stmt.body && containsAttachFinalizer(stmt.body.body || stmt.body)) {
            return true;
        }
        if (stmt.block && containsAttachFinalizer(stmt.block.body || [])) {
            return true;
        }
    }
    return false;
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Queueable classes should attach a Finalizer for error recovery',
            recommended: false,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#queueablewithoutfinalizer',
        },
        messages: {
            noFinalizer:
                "Class '{{name}}' implements Queueable but does not call System.attachFinalizer(). Add a Finalizer to handle execution failures.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexClassDeclaration(node) {
                if (!implementsQueueable(node.interfaces)) {
                    return;
                }

                // Find execute() method
                const executeMethod = (node.body || []).find(
                    (m) =>
                        m.type === 'ApexMethodDeclaration' && m.id.name.toLowerCase() === 'execute',
                );

                if (!executeMethod) {
                    return;
                }

                const body = executeMethod.body ? executeMethod.body.body || [] : [];
                if (!containsAttachFinalizer(body)) {
                    context.report({
                        node,
                        messageId: 'noFinalizer',
                        data: { name: node.id.name },
                    });
                }
            },
        };
    },
};
