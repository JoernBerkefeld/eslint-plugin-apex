/**
 * Rule: security/no-xss-from-url
 * PMD equivalent: ApexXSSFromURLParam
 *
 * Values read from request parameters (ApexPages.currentPage().getParameters(),
 * RestContext.request.params, etc.) are user-controlled and should be
 * sanitized with HTMLENCODE, JSENCODE, or similar before output.
 */

const URL_PARAM_PATTERNS = [
    /apexpages\.currentpage\(\)\.getparameters\(\)/i,
    /\.getparameter\(/i,
    /restcontext\.request\.params/i,
    /apexrest.*\bparams\b/i,
];

const SAFE_ENCODE_PATTERNS = [
    /htmlencode/i,
    /jsencode/i,
    /jsinhtmlencode/i,
    /string\.escapesinglequotes/i,
    /encodingutil/i,
];

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'URL parameter values must be sanitized before output to prevent XSS',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexxssfromurlparam',
        },
        messages: {
            xssFromUrl:
                'URL parameter value accessed without sanitization. Wrap with HTMLENCODE(), JSENCODE(), or String.escapeSingleQuotes() before using in output.',
        },
        schema: [],
    },

    create(context) {
        return {
            ApexMethodCallExpression(node) {
                const callee = (node.rawCallee || '').toLowerCase();
                if (!URL_PARAM_PATTERNS.some((p) => p.test(callee))) {
                    return;
                }

                // Check if the result is immediately wrapped in a safe encoder
                // by looking at the parent node context (not available directly — use heuristic)
                const src = context.sourceCode.getText(node);
                const isSafe = SAFE_ENCODE_PATTERNS.some((p) => p.test(src));
                if (!isSafe) {
                    context.report({ node, messageId: 'xssFromUrl' });
                }
            },
        };
    },
};
