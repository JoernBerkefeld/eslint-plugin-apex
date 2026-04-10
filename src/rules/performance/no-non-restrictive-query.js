/**
 * Rule: perf/no-non-restrictive-query
 * PMD equivalent: AvoidNonRestrictiveQueries
 *
 * SOQL queries without a WHERE clause return all records of a type, which
 * can easily breach governor limits in large orgs. Always add a WHERE clause.
 *
 * Legacy PMD name: WherelessSOQLQuery.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'SOQL queries should include a WHERE clause to limit results',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_performance.html',
        },
        messages: {
            noWhereClause:
                'SOQL query is missing a WHERE clause. Unbounded queries can breach governor limits in large orgs.',
        },
        schema: [],
    },

    create(context) {
        function checkQuery(node) {
            if (node.hasWhereClause || node.hasLimitClause) {
                return;
            }
            context.report({ node, messageId: 'noWhereClause' });
        }

        return {
            ApexSoqlExpression: checkQuery,
        };
    },
};
