/**
 * Rule: security/sharing-violations
 * PMD equivalent: ApexSharingViolations
 *
 * Classes that access data should declare their sharing model explicitly.
 * Omitting `with sharing`, `without sharing`, or `inherited sharing` means
 * the class inherits the model of the calling class, which can lead to
 * unintended data exposure.
 */

const SHARING_KEYWORDS = new Set(['with sharing', 'without sharing', 'inherited sharing']);

function hasSharingDeclaration(modifiers) {
    if (!modifiers) {
        return false;
    }
    return modifiers.some(
        (m) =>
            m.type === 'ApexModifierNode' &&
            (m.value === 'with' || m.value === 'without' || m.value === 'inherited'),
    );
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                "Classes that access data should explicitly declare 'with sharing' or 'without sharing'",
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_security.html#apexsharingviolations',
        },
        messages: {
            noSharingDecl:
                "Class '{{name}}' does not declare a sharing model (with sharing, without sharing, or inherited sharing). Add one to make the intent explicit.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexClassDeclaration(node) {
                // Skip test classes and inner classes (heuristic)
                const isTest = (node.modifiers || []).some(
                    (m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'istest',
                );
                if (isTest) {
                    return;
                }

                const src = context.sourceCode.getText(node);
                const hasSharing = src.toLowerCase().includes('sharing');

                if (!hasSharing) {
                    context.report({
                        node,
                        messageId: 'noSharingDecl',
                        data: { name: node.id.name },
                    });
                }
            },
        };
    },
};
