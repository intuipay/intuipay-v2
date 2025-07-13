USE `test`;

UPDATE `donation_project` p
  LEFT JOIN `user_org_relation` r
    ON p.`org_id`=r.`org_id`
SET
  `banner`=${banner},
  `brand_color`=${brand_color},
  `project_cta`=${cta},
  `thanks_note`=${thanks_note},
  `updated_at`=now()
WHERE p.`id` = ${id}
  AND `user_id`=${user_id};