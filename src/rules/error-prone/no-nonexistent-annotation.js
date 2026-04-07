/**
 * Rule: error/no-nonexistent-annotation
 * PMD equivalent: AvoidNonExistentAnnotations
 *
 * Using annotations that do not exist in Apex may be tolerated by older API
 * versions but is fragile. Flag annotations not in the known Apex annotation set.
 */

const KNOWN_ANNOTATIONS = new Set([
    'istest',
    'auraenabled',
    'invocablemethod',
    'invocablevariable',
    'remoteaction',
    'testsetup',
    'testvisible',
    'readonly',
    'suppresswarnings',
    'restresource',
    'httpdelete',
    'httpget',
    'httppatch',
    'httppost',
    'httpput',
    'namespaceaccessible',
    'jsonaccess',
    'deprecated',
    'future',
    'testmethod',
    'seealldata',
    'istest',
    // Database.Batchable annotations
    'databaseresult',
]);

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Avoid annotations that do not exist in Apex',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#avoidnonexistentannotations',
        },
        messages: {
            unknownAnnotation:
                "'@{{name}}' is not a recognized Apex annotation and may cause errors in future API versions.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexAnnotation(node) {
                const name = (node.name || '').toLowerCase();
                if (!KNOWN_ANNOTATIONS.has(name)) {
                    context.report({
                        node,
                        messageId: 'unknownAnnotation',
                        data: { name: node.name },
                    });
                }
            },
        };
    },
};
