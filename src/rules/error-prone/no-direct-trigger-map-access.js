/**
 * Rule: error/no-direct-trigger-map-access
 * PMD equivalent: AvoidDirectAccessTriggerMap
 *
 * Accessing Trigger.new[0] or Trigger.old[0] directly bypasses null checks and
 * can produce incorrect behavior when the trigger fires for multiple records.
 * Iterate through the collection instead.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Avoid direct index access to Trigger.new or Trigger.old — iterate instead',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#avoiddirectaccesstriggermap',
        },
        messages: {
            directAccess:
                "Direct index access to '{{name}}' detected. Use a for-each loop to iterate over the trigger collection.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexArrayExpression(node) {
                const obj = node.object;
                if (!obj) {
                    return;
                }
                // Check for Trigger.new[n] or Trigger.old[n]
                const name = (obj.rawName || obj.name || '').toLowerCase();
                if (name === 'trigger.new' || name === 'trigger.old') {
                    context.report({
                        node,
                        messageId: 'directAccess',
                        data: { name: obj.rawName || name },
                    });
                }
            },
        };
    },
};
