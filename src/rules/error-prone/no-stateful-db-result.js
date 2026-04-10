/**
 * Rule: error/no-stateful-db-result
 * PMD equivalent: AvoidStatefulDatabaseResult
 *
 * In Database.Stateful batch classes, DML result types (Database.SaveResult,
 * Database.DeleteResult, etc.) stored as instance variables are serialized
 * between execute() calls. These types are not serializable and cause
 * runtime exceptions.
 */

const STATEFUL_TYPES = new Set([
    'database.saveresult',
    'database.deleteresult',
    'database.upsertresult',
    'database.undeleteresult',
    'database.leadconvertresult',
    'database.mergeresult',
    'database.emptyrecyclebinresult',
]);

function implementsStateful(interfaces) {
    return (interfaces || []).some(
        (i) => i.toLowerCase() === 'database.stateful' || i.toLowerCase() === 'stateful',
    );
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Avoid storing Database result types as instance variables in Database.Stateful batch classes',
            recommended: true,
            url: 'https://docs.pmd-code.org/latest/pmd_rules_apex_errorprone.html#avoidstatefuldatabaseresult',
        },
        messages: {
            statefulDbResult:
                "Field '{{name}}' of type '{{type}}' in Database.Stateful class '{{class}}' is not serializable and will cause runtime exceptions.",
        },
        schema: [],
    },

    create(context) {
        return {
            ApexClassDeclaration(node) {
                if (!implementsStateful(node.interfaces)) {
                    return;
                }
                for (const member of node.body || []) {
                    if (member.type !== 'ApexFieldDeclaration') {
                        continue;
                    }
                    const typeName = (
                        member.typeRef ? member.typeRef.name || '' : ''
                    ).toLowerCase();
                    if (STATEFUL_TYPES.has(typeName)) {
                        for (const d of member.declarators || []) {
                            context.report({
                                node: member,
                                messageId: 'statefulDbResult',
                                data: {
                                    name: d.id.name,
                                    type: member.typeRef ? member.typeRef.name : typeName,
                                    class: node.id.name,
                                },
                            });
                        }
                    }
                }
            },
        };
    },
};
