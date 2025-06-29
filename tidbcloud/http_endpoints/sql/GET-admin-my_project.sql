USE `test`;

SELECT `p`.*
FROM `donation_project` p
  LEFT JOIN `user_org_relation` r
    ON p.`org_id`=r.`org_id`
WHERE p.`deleted_at` IS NULL
  AND p.`id`=${id}
  AND r.`user_id`=${user_id};