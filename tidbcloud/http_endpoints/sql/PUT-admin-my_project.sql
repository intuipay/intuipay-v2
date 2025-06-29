USE `test`;

UPDATE `donation_project` p
  LEFT JOIN `user_org_relation` r
    ON p.`org_id`=r.`org_id`
SET
  `project_name` = ${name},
  `project_subtitle` = ${subtitle},
  `project_slug` = ${slug},
  `category` = ${category},
  `type` = ${type},
  `location` = ${location},
  `banner` = ${banner},
  `video` = ${video},
  `social_links` = ${social_links},
  `campaign` = ${campaign},
  `tags` = ${tags},
  `goal_amount` = ${goal_amount},
  `end_at` = ${end_at},
  `accepts` = ${accepts},
  `updated_at`=now()
WHERE p.`id` = ${id}
  AND `user_id`=${user_id};