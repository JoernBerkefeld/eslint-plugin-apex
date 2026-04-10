/**
 * Generate Markdown rule pages under docs/rules from rule implementations.
 * Run: node scripts/generate-rule-docs.mjs
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rules } from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const PREFIX_DIR = [
    ['best-', 'best-practices'],
    ['style-', 'code-style'],
    ['design-', 'design'],
    ['doc-', 'documentation'],
    ['error-', 'error-prone'],
    ['perf-', 'performance'],
    ['security-', 'security'],
];

function partsForRuleId(ruleId) {
    for (const [prefix, dir] of PREFIX_DIR) {
        if (ruleId.startsWith(prefix)) {
            return { docDir: dir, slug: ruleId.slice(prefix.length) };
        }
    }
    throw new Error(`Unknown rule id: ${ruleId}`);
}

function pathToSource(ruleId) {
    const { docDir, slug } = partsForRuleId(ruleId);
    return join(root, 'src', 'rules', docDir, `${slug}.js`);
}

/** Extract PMD name list from file header (stops before the blank * line / prose description). */
function extractPmdBlock(source) {
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
        // Continuation lines are comma-separated PMD identifiers only
        if (/^[A-Za-z][A-Za-z0-9_,\s-]*$/.test(trimmed)) parts.push(trimmed);
        else break;
    }
    return parts.join(' ').replace(/\s+/g, ' ').trim();
}

const PMD_DIFFERENCES = {
    'perf-no-eager-describe':
        'This rule matches **AvoidEagerDescribes** behaviour: describe-style calls inside loops. It does **not** implement **EagerlyLoadedDescribeSObjectResult** (passing `SObjectDescribeOptions` to avoid eager child-relationship loading). Those are separate concerns.',
    'perf-no-high-cost-in-loop':
        'Maps to PMD **OperationWithHighCostInLoop** in current catalogs; **AvoidSoqlInLoops** is kept as a legacy alias key in the PMD converter for older XML.',
    'perf-no-dml-in-loop':
        'Maps to PMD **OperationWithLimitsInLoop**; **AvoidDmlStatementsInLoops** remains a legacy alias for older rule XML.',
    'perf-no-non-restrictive-query':
        'Aligns with **AvoidNonRestrictiveQueries**; **WherelessSOQLQuery** is accepted as a legacy alias.',
    'error-no-hardcoded-id':
        'PMD documents **AvoidHardcodingId**; older spellings may appear in exports.',
    'error-no-type-shadow-namespace':
        'Implements **TypeShadowsBuiltInNamespace**; **AvoidShadowingField** is a related legacy alias in the converter.',
    'error-no-direct-trigger-map-access':
        'Implements **AvoidDirectAccessTriggerMap** naming from current PMD; older keys may omit “Access”.',
    'error-no-stateful-db-result':
        'Covers **AvoidStatefulDatabaseResult**; batch-specific naming variants are aliased in the converter.',
    'error-no-nonexistent-annotation':
        'Covers **AvoidNonExistentAnnotations**; **NonExistentCustomSettingOrMetadata** is a legacy alias.',
    'best-queueable-needs-finalizer':
        'Maps to **QueueableWithoutFinalizer**; **QueueableShouldAttachFinalizer** is a legacy alias.',
    'security-use-named-credentials':
        'PMD rule id is **ApexSuggestUsingNamedCred** (short form on docs.pmd-code.org).',
    'design-no-deep-nesting':
        'Maps to **AvoidDeeplyNestedIfStmts**; older typo keys like `TooDeepCNesting` are still accepted by the converter.',
    'design-ncss-method-count':
        'One implementation aggregates **NcssMethodCount**, **NcssCount**, and **NcssTypeCount** style thresholds from the rule options.',
    'design-cyclomatic-complexity':
        '**StdCyclomaticComplexity** is routed here alongside **CyclomaticComplexity**.',
    'design-no-boolean-parameters':
        'PMD uses **AvoidBooleanMethodParameters**; **AvoidBooleanParameters** is an alias.',
    'style-braces-for-if':
        '**IfElseStmtsMustUseBraces** and **IfStmtsMustUseBraces** both map to this rule.',
    'style-naming-conventions':
        'Covers class, method, field, local, parameter, and property naming PMD rules via options.',
};

function schemaSummary(schema) {
    if (!schema || schema.length === 0) return 'This rule has no configuration options.';
    try {
        const full = JSON.stringify(schema, null, 2);
        return (
            'JSON Schema (see rule source `meta.schema`):\n\n```json\n' +
            full.slice(0, 4000) +
            (full.length > 4000 ? '\n…\n' : '') +
            '\n```'
        );
    } catch {
        return 'See rule source `meta.schema` for options.';
    }
}

function messageTable(meta) {
    const msgs = meta.messages || {};
    const rows = Object.entries(msgs)
        .map(([id, text]) => `| \`${id}\` | ${String(text).replace(/\|/g, '\\|')} |`)
        .join('\n');
    return rows ? `| Message ID | Text |\n|---|---|\n${rows}` : '';
}

function defaultSeverityRow(ruleId, meta) {
    const type = meta.type || 'suggestion';
    const recommended = meta.docs?.recommended ?? false;
    let rec;
    if (!recommended) rec = '`off`';
    else if (type === 'problem') rec = '`error`';
    else rec = '`warn`';
    const sec = ruleId.startsWith('security-') ? '`error`' : '—';
    const perf = ruleId.startsWith('perf-') ? '`error`' : '—';
    return `| **recommended** | ${rec} |\n| **strict** | \`error\` |\n| **security** (profile) | ${sec} |\n| **performance** (profile) | ${perf} |`;
}

async function oneDoc(ruleId, rule) {
    const { docDir, slug } = partsForRuleId(ruleId);
    const srcPath = pathToSource(ruleId);
    const source = await readFile(srcPath, 'utf8');
    const pmd = extractPmdBlock(source) || '_(see `meta.docs.url`)_';
    const meta = rule.meta || {};
    const diff = PMD_DIFFERENCES[ruleId];

    const lines = [];
    lines.push(`# \`apex/${ruleId}\``);
    lines.push('');
    lines.push(`> ${meta.docs?.description || 'Apex lint rule.'}`);
    lines.push('');
    lines.push('| | |');
    lines.push('|---|---|');
    lines.push(`| **Type** | \`${meta.type || 'suggestion'}\` |`);
    lines.push(defaultSeverityRow(ruleId, meta));
    if (meta.docs?.url) {
        lines.push(`| **PMD docs** | [pmd-code.org](${meta.docs.url}) |`);
    }
    lines.push('');
    lines.push('## Why');
    lines.push('');
    lines.push(meta.docs?.description || 'See implementation.');
    lines.push('');
    lines.push('## PMD relationship');
    lines.push('');
    lines.push(`Closest PMD rule name(s): **${pmd}**`);
    if (diff) {
        lines.push('');
        lines.push('### Differences from PMD');
        lines.push('');
        lines.push(diff);
    }
    lines.push('');
    lines.push('## Options');
    lines.push('');
    lines.push(schemaSummary(meta.schema));
    const mt = messageTable(meta);
    if (mt) {
        lines.push('');
        lines.push('## Report messages');
        lines.push('');
        lines.push(mt);
    }
    lines.push('');
    lines.push('## Examples');
    lines.push('');
    lines.push(
        'Illustrative patterns only — adjust to your org’s style. Refer to `tests/rules.test.js` for cases the implementation covers.',
    );
    lines.push('');
    lines.push('```apex');
    lines.push('// Invalid or risky (depends on rule)');
    lines.push('// …');
    lines.push('```');
    lines.push('');
    lines.push('```apex');
    lines.push('// Preferred / compliant');
    lines.push('// …');
    lines.push('```');
    lines.push('');
    lines.push('## When to disable');
    lines.push('');
    lines.push('```js');
    lines.push('// eslint.config.js');
    lines.push(`rules: { 'apex/${ruleId}': 'off' }`);
    lines.push('```');
    lines.push('');

    const outDir = join(root, 'docs', 'rules', docDir);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, `${slug}.md`), lines.join('\n'), 'utf8');
}

const orderedIds = Object.keys(rules).sort();
for (const id of orderedIds) {
    await oneDoc(id, rules[id]);
}
console.log(`Wrote ${orderedIds.length} rule docs under docs/rules/`);
