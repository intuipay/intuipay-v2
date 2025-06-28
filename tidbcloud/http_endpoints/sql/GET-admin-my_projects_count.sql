USE `test`;

SELECT COUNT('x') as `count`
FROM `donation_project` p  
  LEFT JOIN `user_org_relation` r
  ON p.`org_id`=r.`org_id`
WHERE p.`org_id`=${org_id}
  AND IF(${status} > 0, `status` = ${status}, 1)
  AND r.`user_id`=${user_id};