/**
 * Rule: perf/no-eager-describe
 * PMD equivalent: AvoidEagerDescribes
 *
 * Calls to Schema.describeSObjects(), Schema.describeFields(), and
 * Schema.getGlobalDescribe() inside loops or trigger handlers are expensive.
 * Cache the results in a class-level variable.
 */

const DESCRIBE_PATTERNS = [
    /^schema\.getglobaldescribe$/i,
    /^schema\.describeSObjects$/i,
    /^schema\.describefields$/i,
    /^sobjecttype\./i,
    /\.getdescribe$/i,
    /\.getsobjecttype$/i,
];

function isDescribeCall(rawCallee) {
    if (!rawCallee) return false;
    return DESCRIBE_PATTERNS.some((p) => p.test(rawCallee));
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
            description: 'Avoid calling Schema.describe*() methods inside loops — cache results instead',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html#avoideagerdescribes',
        },
        messages: {
            eagerDescribe:
                "Call to '{{callee}}' inside a loop is expensive. Cache the describe result in a class-level variable.",
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
            if (loopDepth > 0 && isDescribeCall(node.rawCallee)) {
                context.report({ node, messageId: 'eagerDescribe', data: { callee: node.rawCallee } });
            }
        };

        return listeners;
    },
};
