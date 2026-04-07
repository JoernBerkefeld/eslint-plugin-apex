/**
 * ESLint-compatible parser for Salesforce Apex.
 *
 * Wraps @apexdevtools/apex-parser (ANTLR4-based) and converts the resulting
 * parse tree into a custom ESLint AST via ast-builder.js.
 *
 * Apex file types are detected by the parser options or file extension:
 *   - compilationUnit  →  .cls files (classes, interfaces, enums)
 *   - triggerUnit      →  .trigger files
 *   - anonymousUnit    →  .apex / .anon files (anonymous Apex scripts)
 */

import { ApexParserFactory, ApexErrorListener } from '@apexdevtools/apex-parser';
import { VISITOR_KEYS } from './node-types.js';
import { buildFromCompilationUnit, buildFromTriggerUnit, buildFromAnonymousUnit } from './ast-builder.js';

// ── Parse entry-point detection ────────────────────────────────────────────

function detectEntryPoint(options) {
    const filename = (options && options.filePath) || '';
    if (filename.endsWith('.trigger')) return 'trigger';
    if (filename.endsWith('.apex') || filename.endsWith('.anon')) return 'anonymous';
    return 'compilation'; // default: .cls
}

// ── Error listener ─────────────────────────────────────────────────────────

class CollectingErrorListener extends ApexErrorListener {
    constructor() {
        super();
        this.errors = [];
    }

    syntaxError(_recognizer, _offendingSymbol, line, charPositionInLine, msg) {
        this.errors.push({ line, column: charPositionInLine, message: msg });
    }
}

// ── Public ESLint parser interface ─────────────────────────────────────────

/**
 * parseForESLint(code, options) — primary ESLint parser entry point.
 *
 * Returns { ast, visitorKeys, services, scopeManager }.
 */
export function parseForESLint(code, options) {
    const errorListener = new CollectingErrorListener();
    const parser = ApexParserFactory.createParser(code);

    // Replace default error listeners with our collecting listener
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);

    const entryPoint = detectEntryPoint(options);
    let tree;
    let result;

    try {
        if (entryPoint === 'trigger') {
            tree = parser.triggerUnit();
            result = buildFromTriggerUnit(tree, code);
        } else if (entryPoint === 'anonymous') {
            tree = parser.anonymousUnit();
            result = buildFromAnonymousUnit(tree, code);
        } else {
            tree = parser.compilationUnit();
            result = buildFromCompilationUnit(tree, code);
        }
    } catch (err) {
        // If the parser throws, produce a minimal Program node with error info
        result = {
            ast: {
                type: 'Program',
                body: [],
                range: [0, code.length],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: code.length },
                },
                tokens: [],
                comments: [],
                errors: [{ message: err.message }],
            },
        };
    }

    return {
        ast: result.ast,
        visitorKeys: VISITOR_KEYS,
        services: {
            parseErrors: errorListener.errors,
        },
        scopeManager: null,
    };
}

/**
 * parse(code, options) — compatibility shim for tools that use the simpler
 * one-argument parse() signature.
 */
export function parse(code, options) {
    return parseForESLint(code, options).ast;
}
