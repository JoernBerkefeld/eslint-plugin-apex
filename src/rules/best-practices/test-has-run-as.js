/**
 * Rule: best/test-has-run-as
 * PMD equivalent: ApexUnitTestClassShouldHaveRunAs
 *
 * Test classes should use System.runAs() to ensure test independence from
 * the running user's permissions and profile.
 */

function isTestClass(node) {
    return (
        node.modifiers &&
        node.modifiers.some((m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'istest')
    );
}

function containsRunAs(body) {
    if (!body) {
        return false;
    }
    const stmts = Array.isArray(body) ? body : body.body || [];
    for (const stmt of stmts) {
        if (!stmt) {
            continue;
        }
        if (stmt.type === 'ApexRunAsStatement') {
            return true;
        }
        if (stmt.body && containsRunAs(stmt.body)) {
            return true;
        }
        if (stmt.block && containsRunAs(stmt.block.body || [])) {
            return true;
        }
        if (stmt.consequent && containsRunAs(stmt.consequent)) {
            return true;
        }
        if (stmt.alternate && containsRunAs(stmt.alternate)) {
            return true;
        }
    }
    return false;
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Test classes should include at least one System.runAs() call',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexunittestclassshouldhaverunas',
        },
        messages: {
            missingRunAs:
                "Test class '{{name}}' does not contain any System.runAs() calls. Ensure tests are user-context independent.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexClassDeclaration(node) {
                if (!isTestClass(node)) {
                    return;
                }
                if (!containsRunAs(node.body)) {
                    context.report({
                        node,
                        messageId: 'missingRunAs',
                        data: { name: node.id.name },
                    });
                }
            },
        };
    },
};
