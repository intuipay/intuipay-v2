USE test;

SELECT `project_name`,`description`,`banner`,`status`,`qrcode`,`wallet_address`,
  `campaign`,`category`,`location`,`type`,`accepts`,`tags`,`goal_amount`,`end_at`,
  `email`,`website`,`github`,`social_x`,`org_name`,`org_slug`,`org_description`,
  `org_type`
FROM `donation_project` p
  LEFT JOIN `organization` o
  ON `p`.`org_id`=`o`.`id`
WHERE `p`.`id` = ${id} ;