USE test;

SELECT o.`id`, `permission`, `org_name`, `org_logo`, `org_slug`, `org_type`
FROM `user_org_relation` r
  LEFT JOIN `organization` o
  ON r.`org_id`=o.`id`
WHERE user_id=${user_id};