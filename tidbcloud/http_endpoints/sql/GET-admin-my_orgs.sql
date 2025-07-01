USE test;

SELECT o.`id`, `permission`, `org_name`, `org_logo`, `org_slug`, `org_type`,
  `org_description`,`org_contact`,`org_location`,`org_website`,`timezone`,
  `email`,`social_links`
FROM `user_org_relation` r
  LEFT JOIN `organization` o
  ON r.`org_id`=o.`id`
WHERE user_id=${user_id};