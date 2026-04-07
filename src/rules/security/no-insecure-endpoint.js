/**
 * Rule: security/no-insecure-endpoint
 * PMD equivalent: ApexInsecureEndpoint
 *
 * HTTP callouts using http:// (not https://) transmit data unencrypted.
 * Always use https:// for callout endpoints.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'HTTP callout endpoints must use HTTPS',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexinsecureendpoint',
        },
        messages: {
            insecureEndpoint:
                "Endpoint '{{url}}' uses HTTP instead of HTTPS. Unencrypted connections expose data in transit.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexLiteralExpression(node) {
                const raw = node.raw || node.value || '';
                if (!raw.startsWith("'") && !raw.startsWith('"')) return;
                const value = raw.slice(1, -1);
                if (value.toLowerCase().startsWith('http://') && !value.toLowerCase().startsWith('https://')) {
                    context.report({
                        node,
                        messageId: 'insecureEndpoint',
                        data: { url: value },
                    });
                }
            },
        };
    },
};
