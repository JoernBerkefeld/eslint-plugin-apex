/**
 * Rule: best/no-logic-in-trigger
 * PMD equivalent: AvoidLogicInTrigger
 *
 * Triggers should contain only a single method call to a dedicated handler
 * class. Embedding logic directly in a trigger makes it hard to test and
 * reuse the logic from other contexts.
 */

const SOQL_TYPES = new Set(['ApexSoqlExpression', 'ApexSoslExpression']);
const DML_TYPES = new Set([
    'ApexInsertStatement',
    'ApexUpdateStatement',
    'ApexDeleteStatement',
    'ApexUndeleteStatement',
    'ApexUpsertStatement',
    'ApexMergeStatement',
]);
const CONTROL_FLOW_TYPES = new Set([
    'ApexIfStatement',
    'ApexForStatement',
    'ApexForEachStatement',
    'ApexWhileStatement',
    'ApexDoWhileStatement',
    'ApexSwitchStatement',
]);

function hasLogic(stmts) {
    if (!stmts) {
        return false;
    }
    for (const stmt of stmts) {
        if (!stmt) {
            continue;
        }
        if (DML_TYPES.has(stmt.type)) {
            return true;
        }
        if (CONTROL_FLOW_TYPES.has(stmt.type)) {
            return true;
        }
        if (
            stmt.type === 'ApexExpressionStatement' &&
            stmt.expression &&
            SOQL_TYPES.has(stmt.expression.type)
        ) {
            return true;
        }
        if (stmt.type === 'ApexLocalVariableDeclaration') {
            return true;
        }
    }
    return false;
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Avoid placing business logic directly in triggers — delegate to handler classes',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#avoidlogicintrigger',
        },
        messages: {
            logicInTrigger:
                "Trigger '{{name}}' contains business logic. Move it to a dedicated handler class for testability and reusability.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexTriggerDeclaration(node) {
                if (hasLogic(node.body)) {
                    context.report({
                        node,
                        messageId: 'logicInTrigger',
                        data: { name: node.id.name },
                    });
                }
            },
        };
    },
};
