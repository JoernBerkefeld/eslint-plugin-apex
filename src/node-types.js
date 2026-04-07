/**
 * Apex AST node types and visitor keys for ESLint traversal.
 *
 * Each key in VISITOR_KEYS maps a custom Apex node type to the list of child
 * properties ESLint should recurse into. These types are produced by
 * ast-builder.js from the ANTLR4 parse tree returned by @apexdevtools/apex-parser.
 */

// ── Node type constants ────────────────────────────────────────────────────

export const NodeType = {
    // Root
    Program: 'Program',

    // Top-level declarations
    ApexClassDeclaration: 'ApexClassDeclaration',
    ApexInterfaceDeclaration: 'ApexInterfaceDeclaration',
    ApexEnumDeclaration: 'ApexEnumDeclaration',
    ApexTriggerDeclaration: 'ApexTriggerDeclaration',

    // Class / interface members
    ApexMethodDeclaration: 'ApexMethodDeclaration',
    ApexConstructorDeclaration: 'ApexConstructorDeclaration',
    ApexFieldDeclaration: 'ApexFieldDeclaration',
    ApexPropertyDeclaration: 'ApexPropertyDeclaration',
    ApexEnumConstant: 'ApexEnumConstant',

    // Statements
    ApexBlockStatement: 'ApexBlockStatement',
    ApexIfStatement: 'ApexIfStatement',
    ApexForStatement: 'ApexForStatement',
    ApexForEachStatement: 'ApexForEachStatement',
    ApexWhileStatement: 'ApexWhileStatement',
    ApexDoWhileStatement: 'ApexDoWhileStatement',
    ApexTryStatement: 'ApexTryStatement',
    ApexCatchClause: 'ApexCatchClause',
    ApexFinallyBlock: 'ApexFinallyBlock',
    ApexReturnStatement: 'ApexReturnStatement',
    ApexThrowStatement: 'ApexThrowStatement',
    ApexBreakStatement: 'ApexBreakStatement',
    ApexContinueStatement: 'ApexContinueStatement',
    ApexRunAsStatement: 'ApexRunAsStatement',
    ApexSwitchStatement: 'ApexSwitchStatement',
    ApexWhenClause: 'ApexWhenClause',

    // DML statements (Apex-specific, not in JavaScript)
    ApexInsertStatement: 'ApexInsertStatement',
    ApexUpdateStatement: 'ApexUpdateStatement',
    ApexDeleteStatement: 'ApexDeleteStatement',
    ApexUndeleteStatement: 'ApexUndeleteStatement',
    ApexUpsertStatement: 'ApexUpsertStatement',
    ApexMergeStatement: 'ApexMergeStatement',

    // Variable declarations
    ApexLocalVariableDeclaration: 'ApexLocalVariableDeclaration',
    ApexVariableDeclarator: 'ApexVariableDeclarator',

    // Expressions
    ApexExpressionStatement: 'ApexExpressionStatement',
    ApexMethodCallExpression: 'ApexMethodCallExpression',
    ApexDotExpression: 'ApexDotExpression',
    ApexArrayExpression: 'ApexArrayExpression',
    ApexAssignExpression: 'ApexAssignExpression',
    ApexNewExpression: 'ApexNewExpression',
    ApexCastExpression: 'ApexCastExpression',
    ApexInstanceOfExpression: 'ApexInstanceOfExpression',
    ApexBinaryExpression: 'ApexBinaryExpression',
    ApexUnaryExpression: 'ApexUnaryExpression',
    ApexTernaryExpression: 'ApexTernaryExpression',
    ApexLiteralExpression: 'ApexLiteralExpression',
    ApexVariableExpression: 'ApexVariableExpression',
    ApexThisExpression: 'ApexThisExpression',
    ApexSuperExpression: 'ApexSuperExpression',

    // SOQL / SOSL
    ApexSoqlExpression: 'ApexSoqlExpression',
    ApexSoslExpression: 'ApexSoslExpression',

    // Modifiers and annotations
    ApexModifierNode: 'ApexModifierNode',
    ApexAnnotation: 'ApexAnnotation',
    ApexAnnotationParameter: 'ApexAnnotationParameter',

    // Parameters and type references
    ApexParameter: 'ApexParameter',
    ApexTypeRef: 'ApexTypeRef',

    // Comments
    ApexComment: 'ApexComment',
};

// ── Visitor keys (used by ESLint to traverse the AST) ─────────────────────

export const VISITOR_KEYS = {
    Program: ['body'],

    ApexClassDeclaration: ['modifiers', 'id', 'body', 'interfaces'],
    ApexInterfaceDeclaration: ['modifiers', 'id', 'body'],
    ApexEnumDeclaration: ['modifiers', 'id', 'constants'],
    ApexTriggerDeclaration: ['id', 'body'],

    ApexMethodDeclaration: ['modifiers', 'id', 'parameters', 'body'],
    ApexConstructorDeclaration: ['modifiers', 'id', 'parameters', 'body'],
    ApexFieldDeclaration: ['modifiers', 'declarators'],
    ApexPropertyDeclaration: ['modifiers', 'id'],
    ApexEnumConstant: [],

    ApexBlockStatement: ['body'],
    ApexIfStatement: ['condition', 'consequent', 'alternate'],
    ApexForStatement: ['body'],
    ApexForEachStatement: ['body'],
    ApexWhileStatement: ['condition', 'body'],
    ApexDoWhileStatement: ['body', 'condition'],
    ApexTryStatement: ['block', 'handlers', 'finalizer'],
    ApexCatchClause: ['block'],
    ApexFinallyBlock: ['block'],
    ApexReturnStatement: ['argument'],
    ApexThrowStatement: ['argument'],
    ApexBreakStatement: [],
    ApexContinueStatement: [],
    ApexRunAsStatement: ['body'],
    ApexSwitchStatement: ['expression', 'cases'],
    ApexWhenClause: ['body'],

    ApexInsertStatement: ['expression'],
    ApexUpdateStatement: ['expression'],
    ApexDeleteStatement: ['expression'],
    ApexUndeleteStatement: ['expression'],
    ApexUpsertStatement: ['expression'],
    ApexMergeStatement: ['expression'],

    ApexLocalVariableDeclaration: ['declarators'],
    ApexVariableDeclarator: ['id', 'init'],

    ApexExpressionStatement: ['expression'],
    ApexMethodCallExpression: ['callee', 'arguments'],
    ApexDotExpression: ['object', 'property'],
    ApexArrayExpression: ['object', 'index'],
    ApexAssignExpression: ['left', 'right'],
    ApexNewExpression: ['arguments'],
    ApexCastExpression: ['expression'],
    ApexInstanceOfExpression: ['expression'],
    ApexBinaryExpression: ['left', 'right'],
    ApexUnaryExpression: ['argument'],
    ApexTernaryExpression: ['condition', 'consequent', 'alternate'],
    ApexLiteralExpression: [],
    ApexVariableExpression: [],
    ApexThisExpression: [],
    ApexSuperExpression: [],

    ApexSoqlExpression: [],
    ApexSoslExpression: [],

    ApexModifierNode: [],
    ApexAnnotation: ['parameters'],
    ApexAnnotationParameter: [],

    ApexParameter: ['id'],
    ApexTypeRef: [],

    ApexComment: [],
};
