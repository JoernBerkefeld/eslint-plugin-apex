/**
 * Rule: security/no-dangerous-methods
 * PMD equivalent: ApexDangerousMethods
 *
 * Several Apex methods can cause data loss, bypass security, or have other
 * dangerous side effects: Database.isSandbox() misuse, PageReference.setRedirect(false),
 * System.abortJob() without checks, etc.
 */

const DANGEROUS_PATTERNS = [
    {
        pattern: /^database\.isssandbox$/i,
        message:
            'Database.isSandbox() is sometimes misused to gate destructive operations. Use Custom Settings for environment-specific behavior.',
    },
    {
        pattern: /^system\.abort$/i,
        message:
            'System.abort() terminates a scheduled job. Ensure this is intentional and guarded.',
    },
    {
        pattern: /^test\.starttest$/i,
        message: null, // not dangerous by itself
        skipInTest: true,
    },
];

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Flag potentially dangerous Apex method calls',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexdangerousmethods',
        },
        messages: {
            dangerousMethod: "Call to '{{callee}}': {{reason}}",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodCallExpression(node) {
                const callee = node.rawCallee || '';
                for (const { pattern, message, skipInTest } of DANGEROUS_PATTERNS) {
                    if (skipInTest) {
                        continue;
                    }
                    if (message && pattern.test(callee)) {
                        context.report({
                            node,
                            messageId: 'dangerousMethod',
                            data: { callee, reason: message },
                        });
                        return;
                    }
                }
            },
        };
    },
};
