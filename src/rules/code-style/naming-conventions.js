/**
 * Rule: style/naming-conventions
 * PMD equivalents: ClassNamingConventions, MethodNamingConventions,
 *   FieldNamingConventions, LocalVariableNamingConventions,
 *   FormalParameterNamingConventions, PropertyNamingConventions
 *
 * Enforces configurable naming conventions across all declaration types.
 * Default: PascalCase for classes/interfaces/enums; camelCase for methods,
 * fields, locals, parameters, properties; UPPER_SNAKE_CASE for constants.
 */

const PATTERNS = {
    pascalCase: /^[A-Z][a-zA-Z0-9]*$/,
    camelCase: /^[a-z][a-zA-Z0-9]*$/,
    upperSnakeCase: /^[A-Z][A-Z0-9_]*$/,
    regex: null,
};

function matchesPattern(name, pattern) {
    if (pattern === 'PascalCase') {
        return PATTERNS.pascalCase.test(name);
    }
    if (pattern === 'camelCase') {
        return PATTERNS.camelCase.test(name);
    }
    if (pattern === 'UPPER_SNAKE_CASE') {
        return PATTERNS.upperSnakeCase.test(name);
    }
    // treat as a raw regex string
    try {
        return new RegExp(pattern).test(name);
    } catch {
        return true;
    }
}

function isConstant(modifiers) {
    return (
        modifiers &&
        modifiers.some((m) => m.value === 'static') &&
        modifiers.some((m) => m.value === 'final')
    );
}

function isStatic(modifiers) {
    return modifiers && modifiers.some((m) => m.value === 'static');
}

function isTestClass(modifiers) {
    return (
        modifiers &&
        modifiers.some((m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'istest')
    );
}

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce configurable naming conventions for Apex declarations',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_codestyle.html#classnaming conventions',
        },
        messages: {
            invalidName:
                "'{{name}}' does not match the expected naming convention for {{kind}} (expected: {{pattern}}).",
        },
        schema: [
            {
                type: 'object',
                properties: {
                    classPattern: { type: 'string', default: 'PascalCase' },
                    testClassPattern: { type: 'string', default: 'PascalCase' },
                    interfacePattern: { type: 'string', default: 'PascalCase' },
                    enumPattern: { type: 'string', default: 'PascalCase' },
                    methodPattern: { type: 'string', default: 'camelCase' },
                    fieldPattern: { type: 'string', default: 'camelCase' },
                    staticFieldPattern: { type: 'string', default: 'camelCase' },
                    constantPattern: { type: 'string', default: 'UPPER_SNAKE_CASE' },
                    localPattern: { type: 'string', default: 'camelCase' },
                    paramPattern: { type: 'string', default: 'camelCase' },
                    propertyPattern: { type: 'string', default: 'camelCase' },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const opts = context.options[0] || {};
        const cfg = {
            classPattern: opts.classPattern || 'PascalCase',
            testClassPattern: opts.testClassPattern || 'PascalCase',
            interfacePattern: opts.interfacePattern || 'PascalCase',
            enumPattern: opts.enumPattern || 'PascalCase',
            methodPattern: opts.methodPattern || 'camelCase',
            fieldPattern: opts.fieldPattern || 'camelCase',
            staticFieldPattern: opts.staticFieldPattern || 'camelCase',
            constantPattern: opts.constantPattern || 'UPPER_SNAKE_CASE',
            localPattern: opts.localPattern || 'camelCase',
            paramPattern: opts.paramPattern || 'camelCase',
            propertyPattern: opts.propertyPattern || 'camelCase',
        };

        function report(node, name, kind, pattern) {
            if (!matchesPattern(name, pattern)) {
                context.report({
                    node,
                    messageId: 'invalidName',
                    data: { name, kind, pattern },
                });
            }
        }

        return {
            ApexClassDeclaration(node) {
                const pattern = isTestClass(node.modifiers)
                    ? cfg.testClassPattern
                    : cfg.classPattern;
                report(node, node.id.name, 'class', pattern);
            },
            ApexInterfaceDeclaration(node) {
                report(node, node.id.name, 'interface', cfg.interfacePattern);
            },
            ApexEnumDeclaration(node) {
                report(node, node.id.name, 'enum', cfg.enumPattern);
            },
            ApexMethodDeclaration(node) {
                // Skip test methods — they often use descriptive names
                const isTest =
                    node.modifiers &&
                    node.modifiers.some(
                        (m) => m.type === 'ApexAnnotation' && m.name.toLowerCase() === 'istest',
                    );
                if (isTest) {
                    return;
                }
                report(node, node.id.name, 'method', cfg.methodPattern);
            },
            ApexFieldDeclaration(node) {
                const pattern = isConstant(node.modifiers)
                    ? cfg.constantPattern
                    : isStatic(node.modifiers)
                      ? cfg.staticFieldPattern
                      : cfg.fieldPattern;
                for (const d of node.declarators || []) {
                    report(d, d.id.name, 'field', pattern);
                }
            },
            ApexPropertyDeclaration(node) {
                report(node, node.id.name, 'property', cfg.propertyPattern);
            },
            ApexLocalVariableDeclaration(node) {
                for (const d of node.declarators || []) {
                    report(d, d.id.name, 'local variable', cfg.localPattern);
                }
            },
            ApexParameter(node) {
                report(node, node.id.name, 'parameter', cfg.paramPattern);
            },
        };
    },
};
