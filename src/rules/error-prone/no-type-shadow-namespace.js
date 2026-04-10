/**
 * Rule: error/no-type-shadow-namespace
 * PMD equivalent: TypeShadowsBuiltInNamespace
 *
 * Declaring a class, enum, or interface with the same name as a type in the
 * System or Schema namespace can cause ambiguous compilation errors and
 * confuse developers.
 */

// A sampling of well-known System and Schema namespace types
const SYSTEM_TYPES = new Set([
    'system',
    'schema',
    'database',
    'test',
    'limits',
    'site',
    'approval',
    'crypto',
    'datetime',
    'date',
    'time',
    'decimal',
    'double',
    'integer',
    'long',
    'string',
    'boolean',
    'blob',
    'id',
    'sobject',
    'list',
    'set',
    'map',
    'exception',
    'type',
    'url',
    'math',
    'json',
    'jsonparser',
    'jsongenerator',
    'trigger',
    'pageref',
    'apexpages',
    'dom',
    'httpresponse',
    'httprequest',
    'http',
]);

export default {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Avoid declaring types with the same name as System or Schema namespace types',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#typeshadowsbuiltinnamespace',
        },
        messages: {
            shadowsBuiltIn:
                "'{{kind}}' '{{name}}' shadows a built-in Apex type in the System or Schema namespace. Choose a different name to avoid ambiguity.",
        },
        schema: [],
    },

    create(context) {
        function checkName(node, kind, name) {
            if (SYSTEM_TYPES.has(name.toLowerCase())) {
                context.report({ node, messageId: 'shadowsBuiltIn', data: { kind, name } });
            }
        }

        return {
            ApexClassDeclaration(node) {
                checkName(node, 'class', node.id.name);
            },
            ApexInterfaceDeclaration(node) {
                checkName(node, 'interface', node.id.name);
            },
            ApexEnumDeclaration(node) {
                checkName(node, 'enum', node.id.name);
            },
        };
    },
};
