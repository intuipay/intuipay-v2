USE test;

SELECT org_id, permission
FROM user_org_relation
WHERE user_id=${user_id};