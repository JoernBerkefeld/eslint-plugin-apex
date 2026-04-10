/**
 * Converts an ANTLR4 parse tree from @apexdevtools/apex-parser into a flat
 * ESLint-compatible AST using the custom Apex node types defined in node-types.js.
 *
 * Each produced node has:
 *   - type: one of the NodeType constants
 *   - range: [startOffset, endOffset]
 *   - loc: { start: {line, column}, end: {line, column} }
 *   - domain-specific child properties per VISITOR_KEYS
 */

import { NodeType } from './node-types.js';

// ── Location helpers ───────────────────────────────────────────────────────

function buildLineTable(text) {
    const starts = [0];
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '\n') {
            starts.push(i + 1);
        } else if (text[i] === '\r') {
            if (text[i + 1] === '\n') {
                starts.push(i + 2);
                i++;
            } else {
                starts.push(i + 1);
            }
        }
    }
    return starts;
}

function offsetToLoc(offset, lineStarts) {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (lineStarts[mid] <= offset) {
            lo = mid;
        } else {
            hi = mid - 1;
        }
    }
    return { line: lo + 1, column: offset - lineStarts[lo] };
}

/**
 * ANTLR4 tokens carry charPositionInLine (column) and line (1-based).
 * We compute absolute offsets from the source string using a character table.
 *
 * @param startToken
 * @param stopToken
 * @param lineStarts
 */
function tokenToRange(startToken, stopToken, lineStarts) {
    const startOffset = lineStarts[startToken.line - 1] + startToken.column;
    // stopToken.column is position of first char of the token; add its text length
    const stopLine = stopToken.line - 1;
    const stopOffset =
        lineStarts[stopLine] + stopToken.column + (stopToken.text ? stopToken.text.length : 0);
    return [startOffset, stopOffset];
}

function nodeLoc(startToken, stopToken, lineStarts) {
    const [startOff, stopOff] = tokenToRange(startToken, stopToken, lineStarts);
    return {
        start: offsetToLoc(startOff, lineStarts),
        end: offsetToLoc(stopOff, lineStarts),
    };
}

function makeNode(type, startToken, stopToken, lineStarts, extras) {
    const [start, end] = tokenToRange(startToken, stopToken, lineStarts);
    return {
        type,
        range: [start, end],
        loc: {
            start: offsetToLoc(start, lineStarts),
            end: offsetToLoc(end, lineStarts),
        },
        ...extras,
    };
}

// ── Modifier helpers ───────────────────────────────────────────────────────

function buildModifiers(modifierList, lineStarts) {
    if (!modifierList || modifierList.length === 0) {
        return [];
    }
    return modifierList.map((mod) => {
        const ann = mod.annotation ? mod.annotation() : null;
        if (ann) {
            return buildAnnotation(ann, lineStarts);
        }
        return makeNode(NodeType.ApexModifierNode, mod.start, mod.stop, lineStarts, {
            value: mod.getText().toLowerCase(),
        });
    });
}

function buildAnnotation(ann, lineStarts) {
    const name = ann.qualifiedName
        ? ann.qualifiedName().getText()
        : ann.id
          ? ann.id().getText()
          : '';
    const elementValuePairs = ann.elementValuePairs ? ann.elementValuePairs() : null;
    const elementValue = ann.elementValue ? ann.elementValue() : null;
    const parameters = [];

    if (elementValuePairs) {
        const pairs = elementValuePairs.elementValuePair_list
            ? elementValuePairs.elementValuePair_list()
            : [];
        for (const pair of pairs) {
            parameters.push(
                makeNode(NodeType.ApexAnnotationParameter, pair.start, pair.stop, lineStarts, {
                    name: pair.id().getText(),
                    value: pair.elementValue().getText(),
                }),
            );
        }
    } else if (elementValue) {
        parameters.push(
            makeNode(
                NodeType.ApexAnnotationParameter,
                elementValue.start,
                elementValue.stop,
                lineStarts,
                {
                    name: null,
                    value: elementValue.getText(),
                },
            ),
        );
    }

    return makeNode(NodeType.ApexAnnotation, ann.start, ann.stop, lineStarts, {
        name,
        parameters,
    });
}

// ── Type reference ─────────────────────────────────────────────────────────

function buildTypeRef(typeRef, lineStarts) {
    if (!typeRef) {
        return null;
    }
    return makeNode(NodeType.ApexTypeRef, typeRef.start, typeRef.stop, lineStarts, {
        name: typeRef.getText(),
    });
}

// ── Parameters ─────────────────────────────────────────────────────────────

function buildParameters(formalParameters, lineStarts) {
    if (!formalParameters) {
        return [];
    }
    const fpl = formalParameters.formalParameterList
        ? formalParameters.formalParameterList()
        : null;
    if (!fpl) {
        return [];
    }
    const params = fpl.formalParameter_list ? fpl.formalParameter_list() : [];
    return params.map((p) =>
        makeNode(NodeType.ApexParameter, p.start, p.stop, lineStarts, {
            id: { type: 'Identifier', name: p.id().getText() },
            typeRef: buildTypeRef(p.typeRef(), lineStarts),
            modifiers: p.modifier_list ? buildModifiers(p.modifier_list(), lineStarts) : [],
        }),
    );
}

// ── Statements ─────────────────────────────────────────────────────────────

function buildBlock(block, lineStarts) {
    if (!block) {
        return null;
    }
    const stmts = block.statement_list ? block.statement_list() : [];
    return makeNode(NodeType.ApexBlockStatement, block.start, block.stop, lineStarts, {
        body: stmts.map((s) => buildStatement(s, lineStarts)).filter(Boolean),
    });
}

function buildStatement(stmt, lineStarts) {
    if (!stmt) {
        return null;
    }

    if (stmt.ifStatement && stmt.ifStatement()) {
        return buildIfStatement(stmt.ifStatement(), lineStarts);
    }
    if (stmt.forStatement && stmt.forStatement()) {
        return buildForStatement(stmt.forStatement(), lineStarts);
    }
    if (stmt.whileStatement && stmt.whileStatement()) {
        return buildWhileStatement(stmt.whileStatement(), lineStarts);
    }
    if (stmt.doWhileStatement && stmt.doWhileStatement()) {
        return buildDoWhileStatement(stmt.doWhileStatement(), lineStarts);
    }
    if (stmt.tryStatement && stmt.tryStatement()) {
        return buildTryStatement(stmt.tryStatement(), lineStarts);
    }
    if (stmt.returnStatement && stmt.returnStatement()) {
        return buildReturnStatement(stmt.returnStatement(), lineStarts);
    }
    if (stmt.throwStatement && stmt.throwStatement()) {
        return buildThrowStatement(stmt.throwStatement(), lineStarts);
    }
    if (stmt.breakStatement && stmt.breakStatement()) {
        return makeNode(NodeType.ApexBreakStatement, stmt.start, stmt.stop, lineStarts, {});
    }
    if (stmt.continueStatement && stmt.continueStatement()) {
        return makeNode(NodeType.ApexContinueStatement, stmt.start, stmt.stop, lineStarts, {});
    }
    if (stmt.insertStatement && stmt.insertStatement()) {
        return buildDmlStatement(NodeType.ApexInsertStatement, stmt.insertStatement(), lineStarts);
    }
    if (stmt.updateStatement && stmt.updateStatement()) {
        return buildDmlStatement(NodeType.ApexUpdateStatement, stmt.updateStatement(), lineStarts);
    }
    if (stmt.deleteStatement && stmt.deleteStatement()) {
        return buildDmlStatement(NodeType.ApexDeleteStatement, stmt.deleteStatement(), lineStarts);
    }
    if (stmt.undeleteStatement && stmt.undeleteStatement()) {
        return buildDmlStatement(
            NodeType.ApexUndeleteStatement,
            stmt.undeleteStatement(),
            lineStarts,
        );
    }
    if (stmt.upsertStatement && stmt.upsertStatement()) {
        return buildDmlStatement(NodeType.ApexUpsertStatement, stmt.upsertStatement(), lineStarts);
    }
    if (stmt.mergeStatement && stmt.mergeStatement()) {
        return buildDmlStatement(NodeType.ApexMergeStatement, stmt.mergeStatement(), lineStarts);
    }
    if (stmt.localVariableDeclarationStatement && stmt.localVariableDeclarationStatement()) {
        return buildLocalVariableDeclaration(
            stmt.localVariableDeclarationStatement().localVariableDeclaration(),
            lineStarts,
        );
    }
    if (stmt.expressionStatement && stmt.expressionStatement()) {
        return makeNode(NodeType.ApexExpressionStatement, stmt.start, stmt.stop, lineStarts, {
            expression: buildExpression(stmt.expressionStatement().expression(), lineStarts),
        });
    }
    if (stmt.runAsStatement && stmt.runAsStatement()) {
        return buildRunAsStatement(stmt.runAsStatement(), lineStarts);
    }
    if (stmt.switchStatement && stmt.switchStatement()) {
        return buildSwitchStatement(stmt.switchStatement(), lineStarts);
    }
    // Nested block
    if (stmt.block && stmt.block()) {
        return buildBlock(stmt.block(), lineStarts);
    }

    // Fallback: opaque statement node
    return makeNode(NodeType.ApexExpressionStatement, stmt.start, stmt.stop, lineStarts, {
        expression: null,
        raw: stmt.getText(),
    });
}

function buildIfStatement(ifStmt, lineStarts) {
    const condition = buildParExpression(ifStmt.parExpression(), lineStarts);
    const stmts = ifStmt.statement_list ? ifStmt.statement_list() : [];
    const elseClause = ifStmt.elseClause ? ifStmt.elseClause() : null;

    return makeNode(NodeType.ApexIfStatement, ifStmt.start, ifStmt.stop, lineStarts, {
        condition,
        consequent: stmts[0] ? buildStatement(stmts[0], lineStarts) : null,
        alternate: elseClause ? buildStatement(elseClause.statement(), lineStarts) : null,
    });
}

function buildForStatement(forStmt, lineStarts) {
    const forClauses = forStmt.forClauses ? forStmt.forClauses() : null;
    const isForEach =
        forClauses && forClauses.enhancedForControl && forClauses.enhancedForControl();
    const body = forStmt.statement ? buildStatement(forStmt.statement(), lineStarts) : null;

    if (isForEach) {
        const efc = forClauses.enhancedForControl();
        return makeNode(NodeType.ApexForEachStatement, forStmt.start, forStmt.stop, lineStarts, {
            param: efc.typeRef ? efc.typeRef().getText() : null,
            paramName: efc.id ? efc.id().getText() : null,
            iterable: efc.expression ? buildExpression(efc.expression(), lineStarts) : null,
            body,
        });
    }

    return makeNode(NodeType.ApexForStatement, forStmt.start, forStmt.stop, lineStarts, {
        body,
    });
}

function buildWhileStatement(whileStmt, lineStarts) {
    return makeNode(NodeType.ApexWhileStatement, whileStmt.start, whileStmt.stop, lineStarts, {
        condition: buildParExpression(whileStmt.parExpression(), lineStarts),
        body: buildStatement(whileStmt.statement(), lineStarts),
    });
}

function buildDoWhileStatement(doWhile, lineStarts) {
    return makeNode(NodeType.ApexDoWhileStatement, doWhile.start, doWhile.stop, lineStarts, {
        body: buildBlock(doWhile.block(), lineStarts),
        condition: buildParExpression(doWhile.parExpression(), lineStarts),
    });
}

function buildTryStatement(tryStmt, lineStarts) {
    const block = buildBlock(tryStmt.block(), lineStarts);
    const catchClauses = tryStmt.catchClause_list ? tryStmt.catchClause_list() : [];
    const finallyBlock = tryStmt.finallyBlock ? tryStmt.finallyBlock() : null;

    const handlers = catchClauses.map((cc) =>
        makeNode(NodeType.ApexCatchClause, cc.start, cc.stop, lineStarts, {
            exceptionType: cc.qualifiedName
                ? cc.qualifiedName().getText()
                : cc.typeRef
                  ? cc.typeRef().getText()
                  : null,
            param: cc.id ? cc.id().getText() : null,
            block: buildBlock(cc.block(), lineStarts),
            // Whether the catch block is empty (no statements) and contains a comment
            isEmpty:
                !cc.block() ||
                (cc.block().statement_list ? cc.block().statement_list().length === 0 : true),
        }),
    );

    const finalizer = finallyBlock
        ? makeNode(NodeType.ApexFinallyBlock, finallyBlock.start, finallyBlock.stop, lineStarts, {
              block: buildBlock(finallyBlock.block(), lineStarts),
          })
        : null;

    return makeNode(NodeType.ApexTryStatement, tryStmt.start, tryStmt.stop, lineStarts, {
        block,
        handlers,
        finalizer,
    });
}

function buildReturnStatement(ret, lineStarts) {
    const expr = ret.expression ? ret.expression() : null;
    return makeNode(NodeType.ApexReturnStatement, ret.start, ret.stop, lineStarts, {
        argument: expr ? buildExpression(expr, lineStarts) : null,
    });
}

function buildThrowStatement(thr, lineStarts) {
    return makeNode(NodeType.ApexThrowStatement, thr.start, thr.stop, lineStarts, {
        argument: buildExpression(thr.expression(), lineStarts),
    });
}

function buildDmlStatement(type, dml, lineStarts) {
    const expr = dml.expression ? dml.expression() : null;
    return makeNode(type, dml.start, dml.stop, lineStarts, {
        expression: expr ? buildExpression(expr, lineStarts) : null,
    });
}

function buildLocalVariableDeclaration(lvd, lineStarts) {
    if (!lvd) {
        return null;
    }
    const vds = lvd.variableDeclarators ? lvd.variableDeclarators() : null;
    const declarators =
        vds && vds.variableDeclarator_list
            ? vds.variableDeclarator_list().map((vd) =>
                  makeNode(NodeType.ApexVariableDeclarator, vd.start, vd.stop, lineStarts, {
                      id: { type: 'Identifier', name: vd.id().getText() },
                      init: vd.expression ? buildExpression(vd.expression(), lineStarts) : null,
                  }),
              )
            : [];

    return makeNode(NodeType.ApexLocalVariableDeclaration, lvd.start, lvd.stop, lineStarts, {
        typeRef: buildTypeRef(lvd.typeRef(), lineStarts),
        declarators,
    });
}

function buildRunAsStatement(runAs, lineStarts) {
    const body = runAs.block ? buildBlock(runAs.block(), lineStarts) : null;
    return makeNode(NodeType.ApexRunAsStatement, runAs.start, runAs.stop, lineStarts, { body });
}

function buildSwitchStatement(sw, lineStarts) {
    const whenClauses = sw.whenClause_list ? sw.whenClause_list() : [];
    return makeNode(NodeType.ApexSwitchStatement, sw.start, sw.stop, lineStarts, {
        expression: sw.expression ? buildExpression(sw.expression(), lineStarts) : null,
        cases: whenClauses.map((wc) =>
            makeNode(NodeType.ApexWhenClause, wc.start, wc.stop, lineStarts, {
                body: buildBlock(wc.block(), lineStarts),
            }),
        ),
    });
}

// ── Expressions ─────────────────────────────────────────────────────────────

function buildParExpression(parExpr, lineStarts) {
    if (!parExpr) {
        return null;
    }
    const expr = parExpr.expression ? parExpr.expression() : null;
    return expr ? buildExpression(expr, lineStarts) : null;
}

function buildExpression(expr, lineStarts) {
    if (!expr) {
        return null;
    }

    const name = expr.constructor.name;

    // Method call: foo(), this.foo(), obj.method()
    if (name === 'MethodCallExpressionContext') {
        const methodCall = expr.methodCall ? expr.methodCall() : null;
        if (methodCall) {
            // MethodCallContext uses expressionList() directly (no arguments() wrapper)
            const exprList = methodCall.expressionList ? methodCall.expressionList() : null;
            const argList = exprList && exprList.expression_list ? exprList.expression_list() : [];
            const calleeName = methodCall.id
                ? methodCall.id().getText()
                : methodCall.THIS
                  ? 'this'
                  : methodCall.SUPER
                    ? 'super'
                    : '';
            return makeNode(NodeType.ApexMethodCallExpression, expr.start, expr.stop, lineStarts, {
                callee: { type: 'Identifier', name: calleeName },
                arguments: argList.map((a) => buildExpression(a, lineStarts)).filter(Boolean),
                rawCallee: calleeName,
            });
        }
    }

    // Dot expression: obj.field, obj.method()
    if (name === 'DotExpressionContext') {
        const dotMethod = expr.dotMethodCall ? expr.dotMethodCall() : null;
        const fieldExpr = expr.fieldExpression ? expr.fieldExpression() : null;
        const obj = expr.expression ? buildExpression(expr.expression(), lineStarts) : null;

        if (dotMethod) {
            // DotMethodCallContext uses expressionList() directly (no intermediate arguments() wrapper)
            const exprList = dotMethod.expressionList ? dotMethod.expressionList() : null;
            const argList = exprList && exprList.expression_list ? exprList.expression_list() : [];
            const methodName = dotMethod.anyId
                ? dotMethod.anyId().getText()
                : dotMethod.id
                  ? dotMethod.id().getText()
                  : '';
            const objName = obj ? obj.rawName || obj.name || '' : '';
            return makeNode(NodeType.ApexMethodCallExpression, expr.start, expr.stop, lineStarts, {
                callee: makeNode(NodeType.ApexDotExpression, expr.start, expr.stop, lineStarts, {
                    object: obj,
                    property: { type: 'Identifier', name: methodName },
                }),
                arguments: argList.map((a) => buildExpression(a, lineStarts)).filter(Boolean),
                rawCallee: objName ? `${objName}.${methodName}` : methodName,
                methodName,
                objectExpression: obj,
            });
        }

        if (fieldExpr) {
            return makeNode(NodeType.ApexDotExpression, expr.start, expr.stop, lineStarts, {
                object: obj,
                property: { type: 'Identifier', name: fieldExpr.getText() },
                rawName: obj ? `${obj.rawName || '?'}.${fieldExpr.getText()}` : fieldExpr.getText(),
            });
        }
    }

    // Array access: arr[i]
    if (name === 'ArrayExpressionContext') {
        return makeNode(NodeType.ApexArrayExpression, expr.start, expr.stop, lineStarts, {
            object: expr.expression_list
                ? buildExpression(expr.expression_list()[0], lineStarts)
                : null,
            index: expr.expression_list
                ? buildExpression(expr.expression_list()[1], lineStarts)
                : null,
        });
    }

    // Assignment: x = expr
    if (name === 'AssignExpressionContext') {
        const exprs = expr.expression_list ? expr.expression_list() : [];
        return makeNode(NodeType.ApexAssignExpression, expr.start, expr.stop, lineStarts, {
            left: exprs[0] ? buildExpression(exprs[0], lineStarts) : null,
            operator: expr.assignmentOperator ? expr.assignmentOperator().getText() : '=',
            right: exprs[1] ? buildExpression(exprs[1], lineStarts) : null,
        });
    }

    // New expression: new Foo(), new List<String>()
    if (name === 'NewExpressionContext') {
        const creator = expr.creator ? expr.creator() : null;
        const createdName = creator && creator.createdName ? creator.createdName().getText() : null;
        // Class constructor args are under classCreatorRest().arguments().expressionList()
        let ctorArgs = [];
        if (creator) {
            const ccr = creator.classCreatorRest ? creator.classCreatorRest() : null;
            if (ccr) {
                const argsCtx = ccr.arguments ? ccr.arguments() : null;
                const exprList =
                    argsCtx && argsCtx.expressionList ? argsCtx.expressionList() : null;
                const rawArgs =
                    exprList && exprList.expression_list ? exprList.expression_list() : [];
                ctorArgs = rawArgs.map((a) => buildExpression(a, lineStarts)).filter(Boolean);
            }
        }
        return makeNode(NodeType.ApexNewExpression, expr.start, expr.stop, lineStarts, {
            className: createdName,
            arguments: ctorArgs,
        });
    }

    // Cast: (Type) expr
    if (name === 'CastExpressionContext') {
        return makeNode(NodeType.ApexCastExpression, expr.start, expr.stop, lineStarts, {
            typeRef: expr.typeRef ? expr.typeRef().getText() : null,
            expression: expr.expression ? buildExpression(expr.expression(), lineStarts) : null,
        });
    }

    // instanceof
    if (name === 'InstanceOfExpressionContext') {
        return makeNode(NodeType.ApexInstanceOfExpression, expr.start, expr.stop, lineStarts, {
            expression: expr.expression ? buildExpression(expr.expression(), lineStarts) : null,
            typeRef: expr.typeRef ? expr.typeRef().getText() : null,
        });
    }

    // Arithmetic / logical binary expressions
    if (
        name === 'Arth1ExpressionContext' ||
        name === 'Arth2ExpressionContext' ||
        name === 'LogAndExpressionContext' ||
        name === 'LogOrExpressionContext' ||
        name === 'CmpExpressionContext' ||
        name === 'EqualityExpressionContext' ||
        name === 'BitAndExpressionContext' ||
        name === 'BitOrExpressionContext' ||
        name === 'BitExpressionContext'
    ) {
        const exprs = expr.expression_list ? expr.expression_list() : [];
        return makeNode(NodeType.ApexBinaryExpression, expr.start, expr.stop, lineStarts, {
            left: exprs[0] ? buildExpression(exprs[0], lineStarts) : null,
            operator:
                exprs.length === 2
                    ? expr
                          .getText()
                          .slice(
                              exprs[0].getText().length,
                              expr.getText().length - exprs[1].getText().length,
                          )
                    : null,
            right: exprs[1] ? buildExpression(exprs[1], lineStarts) : null,
        });
    }

    // Unary / negation
    if (
        name === 'NegExpressionContext' ||
        name === 'PreOpExpressionContext' ||
        name === 'PostOpExpressionContext' ||
        name === 'BitNotExpressionContext'
    ) {
        return makeNode(NodeType.ApexUnaryExpression, expr.start, expr.stop, lineStarts, {
            argument: expr.expression ? buildExpression(expr.expression(), lineStarts) : null,
        });
    }

    // Ternary
    if (name === 'CondExpressionContext') {
        const exprs = expr.expression_list ? expr.expression_list() : [];
        return makeNode(NodeType.ApexTernaryExpression, expr.start, expr.stop, lineStarts, {
            condition: exprs[0] ? buildExpression(exprs[0], lineStarts) : null,
            consequent: exprs[1] ? buildExpression(exprs[1], lineStarts) : null,
            alternate: exprs[2] ? buildExpression(exprs[2], lineStarts) : null,
        });
    }

    // Primary expressions
    if (name === 'PrimaryExpressionContext') {
        const primary = expr.primary ? expr.primary() : null;
        if (primary) {
            return buildPrimary(primary, lineStarts);
        }
    }

    // Sub-expression: (expr)
    if (name === 'SubExpressionContext') {
        return expr.expression ? buildExpression(expr.expression(), lineStarts) : null;
    }

    // SOQL query: [SELECT ...] via array-bracket syntax (less common path)
    if (name === 'ArrayExpressionContext' && expr.getText().toUpperCase().startsWith('[SELECT')) {
        return makeNode(NodeType.ApexSoqlExpression, expr.start, expr.stop, lineStarts, {
            query: expr.getText(),
            hasWhereClause: expr.getText().toUpperCase().includes('WHERE'),
            hasLimitClause: expr.getText().toUpperCase().includes('LIMIT'),
        });
    }

    // Fallback: opaque node
    return makeNode(NodeType.ApexVariableExpression, expr.start, expr.stop, lineStarts, {
        name: expr.getText(),
        rawName: expr.getText(),
    });
}

function buildPrimary(primary, lineStarts) {
    const name = primary.constructor.name;

    if (name === 'LiteralPrimaryContext') {
        const lit = primary.literal ? primary.literal() : null;
        return makeNode(NodeType.ApexLiteralExpression, primary.start, primary.stop, lineStarts, {
            value: lit ? lit.getText() : primary.getText(),
            raw: primary.getText(),
        });
    }

    if (name === 'IdPrimaryContext') {
        return makeNode(NodeType.ApexVariableExpression, primary.start, primary.stop, lineStarts, {
            name: primary.getText(),
            rawName: primary.getText(),
        });
    }

    if (name === 'ThisPrimaryContext') {
        return makeNode(NodeType.ApexThisExpression, primary.start, primary.stop, lineStarts, {});
    }

    if (name === 'SuperPrimaryContext') {
        return makeNode(NodeType.ApexSuperExpression, primary.start, primary.stop, lineStarts, {});
    }

    if (name === 'SoqlPrimaryContext') {
        const soqlLit = primary.soqlLiteral ? primary.soqlLiteral() : null;
        const queryCtx = soqlLit && soqlLit.query ? soqlLit.query() : null;
        const whereCtx = queryCtx && queryCtx.whereClause ? queryCtx.whereClause() : null;
        const limitCtx = queryCtx && queryCtx.limitClause ? queryCtx.limitClause() : null;
        return makeNode(NodeType.ApexSoqlExpression, primary.start, primary.stop, lineStarts, {
            query: primary.getText(),
            hasWhereClause: whereCtx != null,
            hasLimitClause: limitCtx != null,
        });
    }

    if (name === 'SoslPrimaryContext') {
        return makeNode(NodeType.ApexSoslExpression, primary.start, primary.stop, lineStarts, {
            query: primary.getText(),
        });
    }

    // Fallback
    return makeNode(NodeType.ApexVariableExpression, primary.start, primary.stop, lineStarts, {
        name: primary.getText(),
        rawName: primary.getText(),
    });
}

// ── Class member builders ──────────────────────────────────────────────────

function buildMethodDeclaration(classBodyDecl, lineStarts) {
    const modifiers = buildModifiers(
        classBodyDecl.modifier_list ? classBodyDecl.modifier_list() : [],
        lineStarts,
    );
    const member = classBodyDecl.memberDeclaration();
    const md = member.methodDeclaration();

    return makeNode(
        NodeType.ApexMethodDeclaration,
        classBodyDecl.start,
        classBodyDecl.stop,
        lineStarts,
        {
            modifiers,
            id: { type: 'Identifier', name: md.id().getText() },
            returnType: md.typeRef && md.typeRef() ? md.typeRef().getText() : 'void',
            parameters: buildParameters(md.formalParameters(), lineStarts),
            body: md.block ? buildBlock(md.block(), lineStarts) : null,
            isAbstract: !md.block || !md.block(),
        },
    );
}

function buildConstructorDeclaration(classBodyDecl, lineStarts) {
    const modifiers = buildModifiers(
        classBodyDecl.modifier_list ? classBodyDecl.modifier_list() : [],
        lineStarts,
    );
    const member = classBodyDecl.memberDeclaration();
    const cd = member.constructorDeclaration();

    return makeNode(
        NodeType.ApexConstructorDeclaration,
        classBodyDecl.start,
        classBodyDecl.stop,
        lineStarts,
        {
            modifiers,
            id: { type: 'Identifier', name: cd.qualifiedName ? cd.qualifiedName().getText() : '' },
            parameters: buildParameters(cd.formalParameters(), lineStarts),
            body: buildBlock(cd.block(), lineStarts),
        },
    );
}

function buildFieldDeclaration(classBodyDecl, lineStarts) {
    const modifiers = buildModifiers(
        classBodyDecl.modifier_list ? classBodyDecl.modifier_list() : [],
        lineStarts,
    );
    const member = classBodyDecl.memberDeclaration();
    const fd = member.fieldDeclaration();
    const vds = fd.variableDeclarators ? fd.variableDeclarators() : null;
    const declarators =
        vds && vds.variableDeclarator_list
            ? vds.variableDeclarator_list().map((vd) =>
                  makeNode(NodeType.ApexVariableDeclarator, vd.start, vd.stop, lineStarts, {
                      id: { type: 'Identifier', name: vd.id().getText() },
                      init: vd.expression ? buildExpression(vd.expression(), lineStarts) : null,
                  }),
              )
            : [];

    return makeNode(
        NodeType.ApexFieldDeclaration,
        classBodyDecl.start,
        classBodyDecl.stop,
        lineStarts,
        {
            modifiers,
            typeRef: buildTypeRef(fd.typeRef(), lineStarts),
            declarators,
        },
    );
}

function buildPropertyDeclaration(classBodyDecl, lineStarts) {
    const modifiers = buildModifiers(
        classBodyDecl.modifier_list ? classBodyDecl.modifier_list() : [],
        lineStarts,
    );
    const member = classBodyDecl.memberDeclaration();
    const pd = member.propertyDeclaration();

    return makeNode(
        NodeType.ApexPropertyDeclaration,
        classBodyDecl.start,
        classBodyDecl.stop,
        lineStarts,
        {
            modifiers,
            id: { type: 'Identifier', name: pd.id ? pd.id().getText() : '' },
            typeRef: buildTypeRef(pd.typeRef ? pd.typeRef() : null, lineStarts),
            getterModifiers: [],
            setterModifiers: [],
        },
    );
}

function buildClassBodyMembers(classBody, lineStarts) {
    const decls = classBody.classBodyDeclaration_list ? classBody.classBodyDeclaration_list() : [];
    const body = [];

    for (const decl of decls) {
        const member = decl.memberDeclaration ? decl.memberDeclaration() : null;
        if (!member) {
            continue;
        }

        if (member.methodDeclaration && member.methodDeclaration()) {
            body.push(buildMethodDeclaration(decl, lineStarts));
        } else if (member.constructorDeclaration && member.constructorDeclaration()) {
            body.push(buildConstructorDeclaration(decl, lineStarts));
        } else if (member.fieldDeclaration && member.fieldDeclaration()) {
            body.push(buildFieldDeclaration(decl, lineStarts));
        } else if (member.propertyDeclaration && member.propertyDeclaration()) {
            body.push(buildPropertyDeclaration(decl, lineStarts));
        } else if (member.classDeclaration && member.classDeclaration()) {
            // Nested class
            const nestedClass = buildClassDeclaration(decl, lineStarts);
            if (nestedClass) {
                body.push(nestedClass);
            }
        } else if (member.enumDeclaration && member.enumDeclaration()) {
            const nestedEnum = buildEnumDeclaration(decl, lineStarts);
            if (nestedEnum) {
                body.push(nestedEnum);
            }
        }
    }

    return body;
}

// ── Top-level declaration builders ─────────────────────────────────────────

function buildClassDeclaration(typeDecl, lineStarts) {
    // typeDecl is either TypeDeclarationContext (top-level) or ClassBodyDeclarationContext (nested)
    const modifiers = buildModifiers(
        typeDecl.modifier_list ? typeDecl.modifier_list() : [],
        lineStarts,
    );
    // Try direct classDeclaration() first, then via memberDeclaration()
    let cd = null;
    if (typeDecl.classDeclaration && typeDecl.classDeclaration()) {
        cd = typeDecl.classDeclaration();
    } else if (typeDecl.memberDeclaration && typeDecl.memberDeclaration()) {
        const mem = typeDecl.memberDeclaration();
        cd = mem.classDeclaration && mem.classDeclaration() ? mem.classDeclaration() : null;
    }
    if (!cd) {
        return null;
    }

    const superClass = cd.typeRef ? cd.typeRef() : null;
    const interfaces = cd.typeList ? cd.typeList() : null;
    const classBody = cd.classBody ? cd.classBody() : null;

    return makeNode(NodeType.ApexClassDeclaration, typeDecl.start, typeDecl.stop, lineStarts, {
        modifiers,
        id: { type: 'Identifier', name: cd.id ? cd.id().getText() : '' },
        superClass: superClass ? superClass.getText() : null,
        interfaces: interfaces
            ? (interfaces.typeRef_list ? interfaces.typeRef_list() : []).map((t) => t.getText())
            : [],
        body: classBody ? buildClassBodyMembers(classBody, lineStarts) : [],
    });
}

function buildInterfaceDeclaration(typeDecl, lineStarts) {
    const modifiers = buildModifiers(
        typeDecl.modifier_list ? typeDecl.modifier_list() : [],
        lineStarts,
    );
    // Try direct interfaceDeclaration() first
    let iface = null;
    if (typeDecl.interfaceDeclaration && typeDecl.interfaceDeclaration()) {
        iface = typeDecl.interfaceDeclaration();
    } else if (typeDecl.memberDeclaration && typeDecl.memberDeclaration()) {
        const mem = typeDecl.memberDeclaration();
        iface =
            mem.interfaceDeclaration && mem.interfaceDeclaration()
                ? mem.interfaceDeclaration()
                : null;
    }
    if (!iface) {
        return null;
    }

    const interfaceBody = iface.interfaceBody ? iface.interfaceBody() : null;
    const methodDecls = interfaceBody
        ? interfaceBody.interfaceMethodDeclaration_list
            ? interfaceBody.interfaceMethodDeclaration_list()
            : []
        : [];

    return makeNode(NodeType.ApexInterfaceDeclaration, typeDecl.start, typeDecl.stop, lineStarts, {
        modifiers,
        id: { type: 'Identifier', name: iface.id ? iface.id().getText() : '' },
        body: methodDecls.map((m) =>
            makeNode(NodeType.ApexMethodDeclaration, m.start, m.stop, lineStarts, {
                modifiers: buildModifiers(m.modifier_list ? m.modifier_list() : [], lineStarts),
                id: { type: 'Identifier', name: m.id ? m.id().getText() : '' },
                returnType: m.typeRef ? m.typeRef().getText() : 'void',
                parameters: buildParameters(
                    m.formalParameters ? m.formalParameters() : null,
                    lineStarts,
                ),
                body: null,
                isAbstract: true,
            }),
        ),
    });
}

function buildEnumDeclaration(typeDecl, lineStarts) {
    const modifiers = buildModifiers(
        typeDecl.modifier_list ? typeDecl.modifier_list() : [],
        lineStarts,
    );
    // Try direct enumDeclaration() first
    let ed = null;
    if (typeDecl.enumDeclaration && typeDecl.enumDeclaration()) {
        ed = typeDecl.enumDeclaration();
    } else if (typeDecl.memberDeclaration && typeDecl.memberDeclaration()) {
        const mem = typeDecl.memberDeclaration();
        ed = mem.enumDeclaration && mem.enumDeclaration() ? mem.enumDeclaration() : null;
    }
    if (!ed) {
        return null;
    }

    const constants = ed.enumConstants ? ed.enumConstants() : null;
    const constList = constants && constants.id_list ? constants.id_list() : [];

    return makeNode(NodeType.ApexEnumDeclaration, typeDecl.start, typeDecl.stop, lineStarts, {
        modifiers,
        id: { type: 'Identifier', name: ed.id ? ed.id().getText() : '' },
        constants: constList.map((c) =>
            makeNode(NodeType.ApexEnumConstant, c.start, c.stop, lineStarts, {
                name: c.getText(),
            }),
        ),
    });
}

function buildTriggerDeclaration(triggerUnit, lineStarts) {
    const ids = triggerUnit.id_list ? triggerUnit.id_list() : [];
    const triggerName = ids[0] ? ids[0].getText() : '';
    const objectName = ids[1] ? ids[1].getText() : '';
    const cases = triggerUnit.triggerCase_list ? triggerUnit.triggerCase_list() : [];

    const tb = triggerUnit.triggerBlock ? triggerUnit.triggerBlock() : null;
    const members = tb ? (tb.triggerBlockMember_list ? tb.triggerBlockMember_list() : []) : [];

    const body = [];
    for (const m of members) {
        const stmt = m.statement ? m.statement() : null;
        if (stmt) {
            body.push(buildStatement(stmt, lineStarts));
        }
    }

    return makeNode(
        NodeType.ApexTriggerDeclaration,
        triggerUnit.start,
        triggerUnit.stop,
        lineStarts,
        {
            id: { type: 'Identifier', name: triggerName },
            object: objectName,
            events: cases.map((c) => c.getText()),
            body,
        },
    );
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Build an ESLint-compatible AST from a CompilationUnitContext (class file).
 *
 * @param {CompilationUnitContext} tree - root parse tree
 * @param {string} source - original source code
 * @returns {{ ast: object, lineStarts: number[] }}
 */
export function buildFromCompilationUnit(tree, source) {
    const lineStarts = buildLineTable(source);
    const body = [];

    // Apex files contain exactly one top-level type declaration per file.
    // typeDeclaration() returns it; typeDeclaration_list() does not exist.
    const td = tree.typeDeclaration ? tree.typeDeclaration() : null;
    if (td) {
        const cls = td.classDeclaration ? td.classDeclaration() : null;
        const iface = td.interfaceDeclaration ? td.interfaceDeclaration() : null;
        const enm = td.enumDeclaration ? td.enumDeclaration() : null;

        if (cls) {
            const node = buildClassDeclaration(td, lineStarts);
            if (node) {
                body.push(node);
            }
        } else if (iface) {
            const node = buildInterfaceDeclaration(td, lineStarts);
            if (node) {
                body.push(node);
            }
        } else if (enm) {
            const node = buildEnumDeclaration(td, lineStarts);
            if (node) {
                body.push(node);
            }
        }
    }

    const ast = {
        type: 'Program',
        body,
        range: [0, source.length],
        loc: {
            start: { line: 1, column: 0 },
            end: offsetToLoc(source.length, lineStarts),
        },
        tokens: [],
        comments: [],
    };

    return { ast, lineStarts };
}

/**
 * Build an ESLint-compatible AST from a TriggerUnitContext.
 *
 * @param {TriggerUnitContext} tree - root parse tree
 * @param {string} source - original source code
 * @returns {{ ast: object, lineStarts: number[] }}
 */
export function buildFromTriggerUnit(tree, source) {
    const lineStarts = buildLineTable(source);
    const triggerNode = buildTriggerDeclaration(tree, lineStarts);

    const ast = {
        type: 'Program',
        body: [triggerNode],
        range: [0, source.length],
        loc: {
            start: { line: 1, column: 0 },
            end: offsetToLoc(source.length, lineStarts),
        },
        tokens: [],
        comments: [],
    };

    return { ast, lineStarts };
}

/**
 * Build an ESLint-compatible AST from an AnonymousUnitContext (anonymous Apex).
 *
 * @param {AnonymousUnitContext} tree - root parse tree
 * @param {string} source - original source code
 * @returns {{ ast: object, lineStarts: number[] }}
 */
export function buildFromAnonymousUnit(tree, source) {
    const lineStarts = buildLineTable(source);
    const members = tree.anonymousBlockMember_list ? tree.anonymousBlockMember_list() : [];
    const body = [];

    for (const m of members) {
        const stmt = m.statement ? m.statement() : null;
        const lvd = m.localVariableDeclaration ? m.localVariableDeclaration() : null;
        if (stmt) {
            const node = buildStatement(stmt, lineStarts);
            if (node) {
                body.push(node);
            }
        } else if (lvd) {
            const node = buildLocalVariableDeclaration(lvd, lineStarts);
            if (node) {
                body.push(node);
            }
        }
    }

    const ast = {
        type: 'Program',
        body,
        range: [0, source.length],
        loc: {
            start: { line: 1, column: 0 },
            end: offsetToLoc(source.length, lineStarts),
        },
        tokens: [],
        comments: [],
    };

    return { ast, lineStarts };
}
