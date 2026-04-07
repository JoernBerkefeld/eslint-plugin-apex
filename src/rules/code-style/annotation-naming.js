/**
 * Rule: style/annotation-naming
 * PMD equivalent: AnnotationsNamingConventions
 *
 * Annotation names should use PascalCase (e.g. @IsTest, not @istest).
 * Salesforce has made capitalization requirements stricter in recent API versions.
 */

// Well-known Apex annotations with their canonical casing
const CANONICAL = {
    istest: 'IsTest',
    auraenabled: 'AuraEnabled',
    invocablemethod: 'InvocableMethod',
    invocablevariable: 'InvocableVariable',
    remotaction: 'RemoteAction',
    testsetup: 'TestSetup',
    testvisible: 'TestVisible',
    readOnly: 'ReadOnly',
    suppresswarnings: 'SuppressWarnings',
    restresource: 'RestResource',
    httpdelete: 'HttpDelete',
    httpget: 'HttpGet',
    httppatch: 'HttpPatch',
    httppost: 'HttpPost',
    httpput: 'HttpPut',
    namespaceaccessible: 'NamespaceAccessible',
    jsonaccess: 'JsonAccess',
};

const PASCAL_CASE = /^[A-Z][a-zA-Z0-9]*(\.[A-Z][a-zA-Z0-9]*)*$/;

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Annotation names should use PascalCase',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#annotationsnamingconventions',
        },
        messages: {
            wrongCasing:
                "Annotation '@{{name}}' does not use PascalCase. Use '@{{expected}}' instead.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexAnnotation(node) {
                const name = node.name || '';
                const canonical = CANONICAL[name.toLowerCase()];
                if (canonical && name !== canonical) {
                    context.report({
                        node,
                        messageId: 'wrongCasing',
                        data: { name, expected: canonical },
                    });
                } else if (!canonical && !PASCAL_CASE.test(name)) {
                    context.report({
                        node,
                        messageId: 'wrongCasing',
                        data: {
                            name,
                            expected: name.charAt(0).toUpperCase() + name.slice(1),
                        },
                    });
                }
            },
        };
    },
};
