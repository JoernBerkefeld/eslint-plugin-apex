/**
 * Rule: best/test-no-see-all-data
 * PMD equivalent: ApexUnitTestShouldNotUseSeeAllDataTrue
 *
 * Tests annotated with @isTest(seeAllData=true) gain access to real org data,
 * making tests fragile and non-portable. Omit seeAllData or set it to false.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Avoid @isTest(seeAllData=true) as it exposes real org data to test modifications',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_bestpractices.html#apexunittestshouldusenotseealldata',
        },
        messages: {
            seeAllData:
                "@isTest(seeAllData=true) is set on '{{name}}'. Remove it or set seeAllData=false to isolate tests from org data.",
        },
        schema: [],
    },

    create(context) {
        function checkAnnotations(modifiers, node, name) {
            if (!modifiers) return;
            for (const mod of modifiers) {
                if (mod.type !== 'ApexAnnotation') continue;
                if (mod.name.toLowerCase() !== 'istest') continue;
                for (const param of mod.parameters || []) {
                    if (
                        param.name &&
                        param.name.toLowerCase() === 'seealldata' &&
                        param.value &&
                        param.value.toLowerCase() === 'true'
                    ) {
                        context.report({ node, messageId: 'seeAllData', data: { name } });
                    }
                }
            }
        }

        return {
            ApexClassDeclaration(node) {
                checkAnnotations(node.modifiers, node, node.id.name);
            },
            ApexMethodDeclaration(node) {
                checkAnnotations(node.modifiers, node, node.id.name);
            },
        };
    },
};
