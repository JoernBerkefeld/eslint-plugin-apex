/**
 * Rule: security/no-open-redirect
 * PMD equivalent: ApexOpenRedirect
 *
 * PageReference constructed from user-controlled input can redirect users
 * to malicious sites. Validate and whitelist allowed redirect targets.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Avoid constructing PageReference from user-controlled input',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexopenredirect',
        },
        messages: {
            openRedirect:
                "PageReference constructed from a non-literal value may be user-controlled. Validate redirect targets to prevent open redirect vulnerabilities.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexNewExpression(node) {
                if ((node.className || '').toLowerCase() !== 'pagereference') return;
                // Allow if argument is a string literal
                const args = node.arguments || [];
                if (args.length === 0) return;
                const firstArg = args[0];
                if (!firstArg) return;
                if (firstArg.type === 'ApexLiteralExpression') return;
                context.report({ node, messageId: 'openRedirect' });
            },
        };
    },
};
