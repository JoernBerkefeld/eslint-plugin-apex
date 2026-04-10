/**
 * Rule: security/no-hardcoded-crypto
 * PMD equivalent: ApexBadCrypto
 *
 * Hardcoded IVs (initialization vectors) and keys in cryptographic operations
 * are insecure. Use Crypto.generateAesKey() and store sensitive values in
 * Protected Custom Settings or encrypted Custom Metadata.
 */

const BAD_CRYPTO_METHODS = new Set([
    'crypto.encryptwithhex',
    'crypto.decryptwithhex',
    'crypto.encryptwithbyte',
    'crypto.decryptwithbyte',
    'crypto.encrypt',
    'crypto.decrypt',
    'crypto.generatedigest',
    'crypto.generatehmac',
    'crypto.sign',
    'crypto.verify',
]);

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Avoid hardcoded cryptographic keys or IVs',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexbadcrypto',
        },
        messages: {
            hardcodedKey:
                "Cryptographic call '{{method}}' may use a hardcoded key or IV. Use Crypto.generateAesKey() or Protected Custom Settings instead.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodCallExpression(node) {
                const callee = (node.rawCallee || '').toLowerCase();
                if (!BAD_CRYPTO_METHODS.has(callee)) {
                    return;
                }

                // Check if any argument is a string literal (hardcoded key/IV)
                const args = node.arguments || [];
                const hasLiteral = args.some(
                    (a) =>
                        a &&
                        a.type === 'ApexLiteralExpression' &&
                        ((a.raw || '').startsWith("'") || (a.raw || '').startsWith('"')),
                );

                if (hasLiteral) {
                    context.report({
                        node,
                        messageId: 'hardcodedKey',
                        data: { method: node.rawCallee },
                    });
                }
            },
        };
    },
};
