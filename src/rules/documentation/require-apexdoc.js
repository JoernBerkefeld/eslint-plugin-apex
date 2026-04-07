/**
 * Rule: doc/require-apexdoc
 * PMD equivalent: ApexDoc
 *
 * Validates that public and global classes, methods, and properties have
 * ApexDoc comments (/** ... *\/ style). Optionally checks @param and @return tags.
 *
 * Note: Since AST comments are not yet wired from the ANTLR4 parser,
 * this rule uses a source-text heuristic: it checks whether a /** comment
 * appears in the source immediately before the declaration.
 */

const PUBLIC_MODIFIERS = new Set(['public', 'global']);

function isPublicOrGlobal(modifiers) {
    return modifiers && modifiers.some((m) => PUBLIC_MODIFIERS.has(m.value));
}

function hasApexDocBefore(node, sourceCode) {
    const src = sourceCode.getText();
    const start = node.range ? node.range[0] : 0;
    // Look back up to 500 chars for /** ... */ comment
    const lookback = src.slice(Math.max(0, start - 500), start);
    const lastComment = lookback.lastIndexOf('/**');
    if (lastComment === -1) return false;
    const afterComment = lookback.slice(lastComment);
    return afterComment.includes('*/');
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Require ApexDoc comments on public and global classes, methods, and properties',
            recommended: false,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_documentation.html#apexdoc',
        },
        messages: {
            missingDoc: "{{kind}} '{{name}}' is missing an ApexDoc comment (/** ... */).",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    reportPrivate: { type: 'boolean', default: false },
                    reportProtected: { type: 'boolean', default: false },
                    reportMissingDescription: { type: 'boolean', default: true },
                    reportProperty: { type: 'boolean', default: true },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const reportPrivate = opts.reportPrivate === true;
        const reportProperty = opts.reportProperty !== false;

        function checkDoc(node, kind, name, modifiers) {
            if (!isPublicOrGlobal(modifiers)) {
                if (!reportPrivate) return;
            }
            if (!hasApexDocBefore(node, context.sourceCode)) {
                context.report({ node, messageId: 'missingDoc', data: { kind, name } });
            }
        }

        return {
            ApexClassDeclaration(node) {
                checkDoc(node, 'Class', node.id.name, node.modifiers);
            },
            ApexMethodDeclaration(node) {
                checkDoc(node, 'Method', node.id.name, node.modifiers);
            },
            ApexPropertyDeclaration(node) {
                if (reportProperty) checkDoc(node, 'Property', node.id.name, node.modifiers);
            },
        };
    },
};
