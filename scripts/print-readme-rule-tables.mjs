import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rules } from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const PREFIX = [
    ['best-', 'best-practices', 'Best Practices'],
    ['style-', 'code-style', 'Code Style'],
    ['design-', 'design', 'Design'],
    ['doc-', 'documentation', 'Documentation'],
    ['error-', 'error-prone', 'Error Prone'],
    ['perf-', 'performance', 'Performance'],
    ['security-', 'security', 'Security'],
];

function docPath(ruleId) {
    for (const [p, dir] of PREFIX) {
        if (ruleId.startsWith(p)) {
            return `docs/rules/${dir}/${ruleId.slice(p.length)}.md`;
        }
    }
    throw new Error(ruleId);
}

function sourcePath(ruleId) {
    for (const [p, dir] of PREFIX) {
        if (ruleId.startsWith(p)) {
            return join(root, 'src', 'rules', dir, `${ruleId.slice(p.length)}.js`);
        }
    }
    throw new Error(ruleId);
}

function extractPmdLine(source) {
    const idx = source.indexOf('* PMD equivalent');
    if (idx < 0) return '';
    const end = source.indexOf('*/', idx);
    const slice = source.slice(idx, end < 0 ? idx + 800 : end);
    const lines = slice.split('\n');
    const parts = [];
    let started = false;
    for (const raw of lines) {
        const trimmed = raw.replace(/^\s*\*\s?/, '').trim();
        if (!started) {
            if (trimmed.startsWith('PMD equivalent')) {
                started = true;
                const rest = trimmed.replace(/^PMD equivalents?:\s*/i, '').trim();
                if (rest) parts.push(rest);
            }
            continue;
        }
        if (trimmed === '') break;
        if (/^[A-Za-z][A-Za-z0-9_,\s-]*$/.test(trimmed)) parts.push(trimmed);
        else break;
    }
    return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function defaultSev(ruleId, meta) {
    const type = meta.type || 'suggestion';
    const recommended = meta.docs?.recommended ?? false;
    if (!recommended) return 'off';
    return type === 'problem' ? 'error' : 'warn';
}

/** README table: PMD names + short notes where the mirror differs from the header line */
const PMD_NOTES = {
    'error-aura-enabled-getter-public':
        ' (was mis-labeled as AuraEnabledWithoutCatchBlock in older docs)',
    'perf-no-eager-describe': ' (distinct from `EagerlyLoadedDescribeSObjectResult`)',
    'perf-no-dml-in-loop': ' (+ legacy `AvoidDmlStatementsInLoops`)',
    'perf-no-high-cost-in-loop': ' (+ legacy `AvoidSoqlInLoops`)',
    'perf-no-non-restrictive-query': ' (+ legacy `WherelessSOQLQuery`)',
    'error-no-nonexistent-annotation': ' (+ legacy `NonExistentCustomSettingOrMetadata`)',
    'error-no-type-shadow-namespace': ' (+ legacy `AvoidShadowingField`)',
    'best-queueable-needs-finalizer': ' (+ legacy `QueueableShouldAttachFinalizer`)',
};

function pmdCell(ruleId) {
    const raw = extractPmdLine(readFileSync(sourcePath(ruleId), 'utf8'));
    const note = PMD_NOTES[ruleId] || '';
    if (!raw) return '`—`' + note;
    const parts = raw.split(/\s*,\s*/).filter(Boolean);
    const ticked = parts.map((n) => `\`${n.trim()}\``).join(' / ');
    return ticked + note;
}

const bySection = {};
for (const [p, , title] of PREFIX) {
    bySection[title] = [];
}
for (const ruleId of Object.keys(rules).sort()) {
    const title = PREFIX.find(([p]) => ruleId.startsWith(p))?.[2];
    if (!title) throw new Error(ruleId);
    const meta = rules[ruleId].meta;
    const link = `[apex/${ruleId}](${docPath(ruleId)})`;
    const desc = (meta.docs?.description || '').replace(/\|/g, '\\|');
    const pmd = pmdCell(ruleId);
    const def = defaultSev(ruleId, meta);
    bySection[title].push({ link, desc, pmd, def });
}

for (const [p, , title] of PREFIX) {
    console.log(`\n### ${title}\n`);
    console.log('| Rule | Description | PMD equivalent | Default |');
    console.log('|---|---|---|---|');
    for (const row of bySection[title]) {
        console.log(`| ${row.link} | ${row.desc} | ${row.pmd} | ${row.def} |`);
    }
}
