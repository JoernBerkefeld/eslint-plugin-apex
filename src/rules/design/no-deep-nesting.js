/**
 * Rule: design/no-deep-nesting
 * PMD equivalent: AvoidDeeplyNestedIfStmts
 *
 * Flags deeply nested if statements. Each additional nesting level makes code
 * harder to read and test. Default threshold: 3 levels.
 */

const NESTING_NODES = new Set([
    'ApexIfStatement',
    'ApexForStatement',
    'ApexForEachStatement',
    'ApexWhileStatement',
    'ApexDoWhileStatement',
]);

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Avoid deeply nested if statements',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#avoiddeeplynestedifstmts',
        },
        messages: {
            tooDeep:
                'Deeply nested statement found at level {{level}} (threshold: {{threshold}}). Consider extracting logic into a separate method.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    problemDepth: { type: 'number', default: 3 },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const problemDepth = opts.problemDepth ?? 3;
        let currentDepth = 0;

        function enter(node) {
            currentDepth++;
            if (currentDepth > problemDepth) {
                context.report({
                    node,
                    messageId: 'tooDeep',
                    data: { level: currentDepth, threshold: problemDepth },
                });
            }
        }

        function exit() {
            currentDepth--;
        }

        const listeners = {};
        for (const nodeType of NESTING_NODES) {
            listeners[nodeType] = enter;
            listeners[`${nodeType}:exit`] = exit;
        }
        return listeners;
    },
};
