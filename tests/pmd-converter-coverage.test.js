/**
 * PMD rule names from docs/apex-pmd mirror headings vs PMD_TO_ESLINT in docs/index.html.
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { rules } from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.join(__dirname, '..');
const apexPmdRoot = path.join(pluginRoot, '..', 'docs', 'apex-pmd');

const MIRROR_FILES = [
    'bestpractices.md',
    'codestyle.md',
    'design.md',
    'documentation.md',
    'errorprone.md',
    'performance.md',
    'security.md',
];

/** Normalized keys that intentionally have no apex/* implementation yet */
const UNMAPPED = new Set([
    'excessiveclasslength',
    'emptystatementblock',
    'eagerlyloadeddescribesobjectresult',
    'ncssconstructorcount',
]);

function extractPmdRuleNamesFromMirror() {
    const names = [];
    for (const file of MIRROR_FILES) {
        const p = path.join(apexPmdRoot, file);
        const text = readFileSync(p, 'utf8');
        const re = /^### \d+\. ([A-Za-z][A-Za-z0-9]*)$/gm;
        let m;
        while ((m = re.exec(text))) {
            names.push(m[1]);
        }
    }
    return names;
}

function parsePmdToEslintFromHtml() {
    const html = readFileSync(path.join(pluginRoot, 'docs', 'index.html'), 'utf8');
    const start = html.indexOf('const PMD_TO_ESLINT = {');
    if (start === -1) {
        throw new Error('PMD_TO_ESLINT block not found in docs/index.html');
    }
    const brace = html.indexOf('{', start);
    let depth = 0;
    let i = brace;
    for (; i < html.length; i++) {
        const c = html[i];
        if (c === '{') {
            depth++;
        } else if (c === '}') {
            depth--;
            if (depth === 0) {
                i++;
                break;
            }
        }
    }
    const body = html.slice(brace, i);
    const map = Object.create(null);
    const re = /([a-z0-9]+)\s*:\s*'([^']+)'/g;
    let m;
    while ((m = re.exec(body))) {
        const k = m[1];
        if (map[k]) {
            throw new Error(`Duplicate PMD_TO_ESLINT key: ${k}`);
        }
        map[k] = m[2];
    }
    return map;
}

function normalizePmdName(name) {
    return name.toLowerCase().replace(/rule$/, '');
}

test('PMD mirror rule headings map to eslint ids or explicit UNMAPPED', (t) => {
    if (!existsSync(apexPmdRoot)) {
        t.skip(`apex-pmd mirror not found at ${apexPmdRoot} (standalone clone?)`);
        return;
    }
    const pmdNames = extractPmdRuleNamesFromMirror();
    if (pmdNames.length < 60) {
        throw new Error(`Expected many PMD rules from mirror, got ${pmdNames.length}`);
    }
    const conv = parsePmdToEslintFromHtml();
    const missing = [];
    for (const name of pmdNames) {
        const key = normalizePmdName(name);
        const eslintId = conv[key];
        if (!eslintId) {
            if (!UNMAPPED.has(key)) {
                missing.push(name);
            }
            continue;
        }
        if (eslintId.startsWith('custom-')) {
            missing.push(`${name} -> ${eslintId}`);
            continue;
        }
        if (!rules[eslintId]) {
            throw new Error(`PMD ${name} maps to unknown eslint id: ${eslintId}`);
        }
    }
    if (missing.length > 0) {
        throw new Error(`PMD names without converter mapping:\n${missing.join('\n')}`);
    }
});

test('PMD XSS URL param keys include corrected spelling', () => {
    const conv = parsePmdToEslintFromHtml();
    if (conv.apexxssfromurlparam !== 'security-no-xss-from-url') {
        throw new Error('Missing apexxssfromurlparam alias');
    }
});
