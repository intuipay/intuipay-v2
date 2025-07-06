USE `test`;

SELECT `project_name`,`project_slug`,`project_subtitle`,`description`,
  `banner`,`published_at`,`end_at`,`goal_amount`,`amount`,`status`,p.`id`
FROM `donation_project` p
  LEFT JOIN `user_org_relation` r
  ON p.`org_id`=r.`org_id`
WHERE `deleted_at` IS NULL AND `is_widget`=${is_widget}
  AND p.`org_id`=${org_id}
  AND IF(${status} > 0, `status` = ${status}, 1)
  AND r.`user_id`=${user_id}
ORDER BY p.`id` DESC
LIMIT ${start}, ${pagesize};