/**
 * Ensures every registered rule has a matching docs/rules/.../*.md page.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { rules } from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const PREFIX_DIR = [
    ['best-', 'best-practices'],
    ['style-', 'code-style'],
    ['design-', 'design'],
    ['doc-', 'documentation'],
    ['error-', 'error-prone'],
    ['perf-', 'performance'],
    ['security-', 'security'],
];

function docPathForRule(ruleId) {
    for (const [prefix, dir] of PREFIX_DIR) {
        if (ruleId.startsWith(prefix)) {
            return path.join(root, 'docs', 'rules', dir, `${ruleId.slice(prefix.length)}.md`);
        }
    }
    throw new Error(`Unknown rule id: ${ruleId}`);
}

test('every registered rule has a docs/rules markdown page', () => {
    const ids = Object.keys(rules).toSorted();
    for (const id of ids) {
        const p = docPathForRule(id);
        if (!existsSync(p)) {
            throw new Error(`Missing doc file for ${id}: expected ${p}`);
        }
    }
    if (ids.length !== 57) {
        throw new Error(
            `Expected 57 rules, got ${ids.length} — update docs-coverage if registry changed.`,
        );
    }
});
