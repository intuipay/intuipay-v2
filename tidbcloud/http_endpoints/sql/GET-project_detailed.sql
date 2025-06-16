USE test;

SELECT `p`.`id`,`project_name`,`description`,`banner`,`status`,`qrcode`,`wallet_address`,
  `campaign`,`category`,`location`,`type`,`accepts`,`tags`,`amount`,`goal_amount`,
  `end_at`,`p`.`email`,`website`,`github`,`tags`,`org_name`,`org_slug`,
  `org_description`,`org_type`,`org_contact`,`org_location`,`org_website`,
  `org_logo`,`banners`,`backers`,`o`.`email` as `org_email`,`org_description`,
  `org_title`,p.`social_links`,`o`.social_links as `org_social_links`
FROM `donation_project` p
  LEFT JOIN `organization` o
  ON `p`.`org_id`=`o`.`id`
WHERE `p`.`project_slug` = ${slug} ;