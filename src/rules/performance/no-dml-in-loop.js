/**
 * Rule: perf/no-dml-in-loop
 * PMD equivalent: OperationWithLimitsInLoop
 *
 * DML operations (INSERT, UPDATE, DELETE, etc.), SOQL/SOSL queries, and
 * other governor-limited Apex calls inside loops hit governor limits quickly.
 * Bulk them outside the loop using collections.
 */

const DML_TYPES = new Set([
    'ApexInsertStatement',
    'ApexUpdateStatement',
    'ApexDeleteStatement',
    'ApexUndeleteStatement',
    'ApexUpsertStatement',
    'ApexMergeStatement',
]);

// High-cost method calls that should not be inside loops
const HIGH_COST_PATTERNS = [
    /^database\./i,
    /^approval\./i,
    /^messaging\.sendemail$/i,
    /^eventbus\.publish$/i,
    /^system\.enqueueJob$/i,
    /^system\.scheduleBatch$/i,
];

function isHighCostCall(rawCallee) {
    if (!rawCallee) {
        return false;
    }
    return HIGH_COST_PATTERNS.some((p) => p.test(rawCallee));
}

const LOOP_TYPES = new Set([
    'ApexForStatement',
    'ApexForEachStatement',
    'ApexWhileStatement',
    'ApexDoWhileStatement',
]);

export default {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Avoid DML operations, SOQL queries, and governor-limited calls inside loops',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html#operationwithlimitsinloop',
        },
        messages: {
            dmlInLoop:
                'DML operation inside a loop hits governor limits. Collect records and DML outside the loop.',
            soqlInLoop:
                'SOQL/SOSL query inside a loop hits governor limits. Use a single bulk query outside the loop.',
            highCostInLoop:
                "Call to '{{callee}}' inside a loop hits governor limits. Move it outside the loop.",
        },
        schema: [],
    },

    create(context) {
        let loopDepth = 0;

        const loopEnter = () => {
            loopDepth++;
        };
        const loopExit = () => {
            loopDepth--;
        };

        const listeners = {};
        for (const t of LOOP_TYPES) {
            listeners[t] = loopEnter;
            listeners[`${t}:exit`] = loopExit;
        }

        Object.assign(listeners, {
            ApexInsertStatement(node) {
                if (loopDepth > 0) {
                    context.report({ node, messageId: 'dmlInLoop' });
                }
            },
            ApexUpdateStatement(node) {
                if (loopDepth > 0) {
                    context.report({ node, messageId: 'dmlInLoop' });
                }
            },
            ApexDeleteStatement(node) {
                if (loopDepth > 0) {
                    context.report({ node, messageId: 'dmlInLoop' });
                }
            },
            ApexUndeleteStatement(node) {
                if (loopDepth > 0) {
                    context.report({ node, messageId: 'dmlInLoop' });
                }
            },
            ApexUpsertStatement(node) {
                if (loopDepth > 0) {
                    context.report({ node, messageId: 'dmlInLoop' });
                }
            },
            ApexMergeStatement(node) {
                if (loopDepth > 0) {
                    context.report({ node, messageId: 'dmlInLoop' });
                }
            },
            ApexSoqlExpression(node) {
                if (loopDepth > 0) {
                    context.report({ node, messageId: 'soqlInLoop' });
                }
            },
            ApexSoslExpression(node) {
                if (loopDepth > 0) {
                    context.report({ node, messageId: 'soqlInLoop' });
                }
            },
            ApexMethodCallExpression(node) {
                if (loopDepth > 0 && isHighCostCall(node.rawCallee)) {
                    context.report({
                        node,
                        messageId: 'highCostInLoop',
                        data: { callee: node.rawCallee },
                    });
                }
            },
        });

        return listeners;
    },
};
