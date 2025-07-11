USE `test`;

UPDATE `donation_project` p
  LEFT JOIN `user_org_relation` o
    ON p.`org_id`=o.`org_id`
SET `project_name`=${name},`project_slug`=${slug}
WHERE `id`=${id} AND `user_id`=${user_id};