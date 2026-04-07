/**
 * Rule: security/use-named-credentials
 * PMD equivalent: ApexSuggestUsingNamedCred
 *
 * Hardcoded credentials (usernames, passwords, tokens) in HTTP requests or
 * AuthProviders should be stored in Named Credentials instead.
 */

const HEADER_PATTERNS = [
    /authorization/i,
    /x-api-key/i,
    /x-auth-token/i,
    /api[_-]?key/i,
    /password/i,
    /secret/i,
    /token/i,
];

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Use Named Credentials instead of hardcoding authentication details in HTTP requests',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexsuggestusingnamedcred',
        },
        messages: {
            useNamedCreds:
                "HttpRequest.setHeader() with '{{header}}' may contain hardcoded credentials. Use Named Credentials (callout:NamedCred/...) instead.",
            useNamedCredsEndpoint:
                "HttpRequest endpoint '{{url}}' does not use a Named Credential. Prefix callout endpoints with 'callout:' to use Named Credentials.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodCallExpression(node) {
                const callee = (node.rawCallee || '').toLowerCase();

                // setheader with auth-related header names
                if (callee.endsWith('.setheader') || callee === 'setheader') {
                    const args = node.arguments || [];
                    const headerArg = args[0];
                    if (
                        headerArg &&
                        headerArg.type === 'ApexLiteralExpression' &&
                        HEADER_PATTERNS.some((p) => p.test(headerArg.value || headerArg.raw || ''))
                    ) {
                        context.report({
                            node,
                            messageId: 'useNamedCreds',
                            data: { header: headerArg.value || headerArg.raw },
                        });
                    }
                }

                // setendpoint with http:// (already caught by no-insecure-endpoint)
                // or any non-callout: URL
                if (callee.endsWith('.setendpoint') || callee === 'setendpoint') {
                    const args = node.arguments || [];
                    const urlArg = args[0];
                    if (
                        urlArg &&
                        urlArg.type === 'ApexLiteralExpression'
                    ) {
                        const url = (urlArg.value || urlArg.raw || '').replace(/'/g, '');
                        if (!url.startsWith('callout:') && !url.startsWith('{!')) {
                            context.report({
                                node,
                                messageId: 'useNamedCredsEndpoint',
                                data: { url },
                            });
                        }
                    }
                }
            },
        };
    },
};
