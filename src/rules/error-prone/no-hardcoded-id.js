/**
 * Rule: error/no-hardcoded-id
 * PMD equivalent: AvoidHardcodingId
 *
 * Salesforce record IDs are environment-specific (sandbox vs. production).
 * Hardcoding them makes code non-portable. Use custom settings, labels, or
 * query results instead.
 */

// Salesforce ID patterns: 15-char or 18-char alphanumeric
const SF_ID_15 = /\b[a-zA-Z0-9]{15}\b/;
const SF_ID_18 = /\b[a-zA-Z0-9]{18}\b/;
// Key prefixes suggest these are IDs (start with 3 alphanum chars)
const LIKELY_ID = /^[a-zA-Z0-9]{3}[a-zA-Z0-9]{12}$|^[a-zA-Z0-9]{3}[a-zA-Z0-9]{15}$/;

export default {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Avoid hardcoding Salesforce record IDs — they differ between environments',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#avoidhardcodingid',
        },
        messages: {
            hardcodedId:
                "Hardcoded Salesforce ID '{{value}}' detected. IDs are environment-specific. Use Custom Settings, Custom Labels, or dynamic SOQL instead.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexLiteralExpression(node) {
                const raw = node.raw || node.value || '';
                // Only check string literals
                if (!raw.startsWith("'") && !raw.startsWith('"')) {
                    return;
                }
                const value = raw.slice(1, -1);
                if (LIKELY_ID.test(value)) {
                    context.report({
                        node,
                        messageId: 'hardcodedId',
                        data: { value },
                    });
                }
            },
        };
    },
};
