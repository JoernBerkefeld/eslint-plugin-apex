/**
 * Rule: perf/no-high-cost-in-loop
 * PMD equivalent: AvoidHighCostInLoopWithoutBulkification
 *
 * Identifies additional high-cost Apex patterns that should be avoided inside
 * loops. This complements no-dml-in-loop by focusing on non-DML patterns like
 * System.enqueueJob(), Messaging.sendEmail(), and EventBus.publish().
 */

const HIGH_COST_PATTERNS = [
    { pattern: /^system\.enqueuejob$/i, label: 'System.enqueueJob()' },
    { pattern: /^system\.schedulebatch$/i, label: 'System.scheduleBatch()' },
    { pattern: /^messaging\.sendemail$/i, label: 'Messaging.sendEmail()' },
    { pattern: /^eventbus\.publish$/i, label: 'EventBus.publish()' },
    { pattern: /^process\.submit$/i, label: 'Process.submit()' },
    { pattern: /^approval\.process$/i, label: 'Approval.process()' },
    { pattern: /^system\.runAs$/i, label: 'System.runAs()' },
];

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
            description: 'Avoid high-cost Apex calls inside loops',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html',
        },
        messages: {
            highCostInLoop:
                "'{{callee}}' inside a loop is expensive. Bulkify by collecting items and calling outside the loop.",
        },
        schema: [],
    },

    create(context) {
        let loopDepth = 0;
        const listeners = {};

        for (const t of LOOP_TYPES) {
            listeners[t] = () => { loopDepth++; };
            listeners[`${t}:exit`] = () => { loopDepth--; };
        }

        listeners.ApexMethodCallExpression = function (node) {
            if (loopDepth === 0) return;
            const callee = node.rawCallee || '';
            for (const { pattern, label } of HIGH_COST_PATTERNS) {
                if (pattern.test(callee)) {
                    context.report({ node, messageId: 'highCostInLoop', data: { callee: label } });
                    return;
                }
            }
        };

        return listeners;
    },
};
