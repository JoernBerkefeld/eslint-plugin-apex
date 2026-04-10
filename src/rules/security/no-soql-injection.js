/**
 * Rule: security/no-soql-injection
 * PMD equivalent: ApexSOQLInjection
 *
 * Constructing SOQL queries using string concatenation with user-supplied
 * values can allow SOQL injection attacks. Use bind variables (:variable)
 * or String.escapeSingleQuotes() to sanitize input.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Avoid SOQL injection — use bind variables or String.escapeSingleQuotes()',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexsoqlinjection',
        },
        messages: {
            soqlInjection:
                'Dynamic SOQL query built via string concatenation may be vulnerable to SOQL injection. Use bind variables (:variable) or String.escapeSingleQuotes().',
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodCallExpression(node) {
                const callee = (node.rawCallee || '').toLowerCase();
                if (callee !== 'database.query' && callee !== 'query') {
                    return;
                }

                // If the argument is not a simple string literal, flag it
                const args = node.arguments || [];
                if (args.length === 0) {
                    return;
                }
                const firstArg = args[0];
                if (!firstArg) {
                    return;
                }

                // Literal string is OK (static query)
                if (firstArg.type === 'ApexLiteralExpression') {
                    return;
                }
                // escapeSingleQuotes is OK
                if (
                    firstArg.type === 'ApexMethodCallExpression' &&
                    (firstArg.rawCallee || '').toLowerCase() === 'string.escapesinglequotes'
                ) {
                    return;
                }

                context.report({ node, messageId: 'soqlInjection' });
            },
        };
    },
};
