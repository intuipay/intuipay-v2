USE test;

SELECT `org_id`, `permission`, `org_name`, `org_logo`, `org_slug`
FROM `user_org_relation` r
  LEFT JOIN `organization` o
  ON r.`org_id`=o.`id`
WHERE user_id=${user_id};