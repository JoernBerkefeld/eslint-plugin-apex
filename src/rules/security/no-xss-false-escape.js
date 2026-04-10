/**
 * Rule: security/no-xss-false-escape
 * PMD equivalent: ApexXSSFromEscapeFalse
 *
 * Setting escape="false" in Visualforce components or using
 * EncodingUtil.forceEscape=false disables automatic HTML escaping and can
 * introduce Cross-Site Scripting (XSS) vulnerabilities.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disabling HTML escaping (escape=false) can introduce XSS vulnerabilities',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexxssfromescape false',
        },
        messages: {
            xssFalseEscape:
                'Setting escape to false can introduce XSS vulnerabilities. Use the default HTML-escaped output.',
        },
        schema: [],
    },

    create(context) {
        return {
            ApexAnnotationParameter(node) {
                if (
                    (node.name || '').toLowerCase() === 'escape' &&
                    (node.value || '').toLowerCase() === 'false'
                ) {
                    context.report({ node, messageId: 'xssFalseEscape' });
                }
            },
        };
    },
};
