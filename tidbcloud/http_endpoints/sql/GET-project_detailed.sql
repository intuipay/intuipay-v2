USE test;

SELECT `p`.`id`,`project_name`,`banner`,`status`,
  `campaign`,`category`,`location`,`type`,`accepts`,`tags`,`amount`,`goal_amount`,
  `end_at`,`p`.`email`,`website`,`github`,`org_name`,`org_slug`,`project_subtitle`,
  `org_description`,`org_type`,`org_contact`,`org_location`,`org_website`,
  `org_logo`,`banners`,`backers`,`o`.`email` as `org_email`,`org_description`,
  `org_title`,p.`social_links`,`o`.social_links as `org_social_links`
FROM `donation_project` p
  LEFT JOIN `organization` o
  ON `p`.`org_id`=`o`.`id`
WHERE `p`.`deleted_at` IS NULL
  AND `o`.`deleted_at` IS NULL
  AND IF(LENGTH(${slug}), `p`.`project_slug` = ${slug}, 1)
  AND IF(LENGTH(${id}), `p`.`id` = ${id}, `p`.`status` = 10);