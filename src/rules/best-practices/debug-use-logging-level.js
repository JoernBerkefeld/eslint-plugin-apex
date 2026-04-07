/**
 * Rule: best/debug-use-logging-level
 * PMD equivalent: DebugsShouldUseLoggingLevel
 *
 * System.debug() calls should always specify a LoggingLevel enum value as the
 * first argument so that developers can control verbosity in production orgs.
 * In strict mode, even LoggingLevel.DEBUG is flagged.
 */

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'System.debug() calls should specify a LoggingLevel argument',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#debugsshoulduselogginglevel',
        },
        messages: {
            missingLevel:
                'System.debug() is called without a LoggingLevel argument. Specify LoggingLevel.INFO, LoggingLevel.WARN, etc.',
            debugLevel:
                'System.debug() is called with LoggingLevel.DEBUG. Use a more specific level like LoggingLevel.INFO.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    strictMode: { type: 'boolean', default: false },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const strictMode = (context.options[0] || {}).strictMode === true;

        function isSystemDebug(node) {
            if (node.type !== 'ApexMethodCallExpression') return false;
            const callee = (node.rawCallee || '').toLowerCase();
            return callee === 'system.debug' || callee === 'debug';
        }

        function hasLoggingLevelArg(args) {
            if (!args || args.length === 0) return false;
            const firstArg = args[0];
            if (!firstArg) return false;
            const text = (firstArg.name || firstArg.rawName || '').toLowerCase();
            return text.startsWith('logginglevel.');
        }

        function isDebugLevel(args) {
            if (!args || args.length === 0) return false;
            const firstArg = args[0];
            if (!firstArg) return false;
            const text = (firstArg.name || firstArg.rawName || '').toLowerCase();
            return text === 'logginglevel.debug';
        }

        return {
            ApexMethodCallExpression(node) {
                if (!isSystemDebug(node)) return;
                const args = node.arguments || [];
                if (args.length < 2) {
                    // Single-arg System.debug(msg) — missing LoggingLevel
                    context.report({ node, messageId: 'missingLevel' });
                } else if (strictMode && isDebugLevel(args)) {
                    context.report({ node, messageId: 'debugLevel' });
                }
            },
        };
    },
};
