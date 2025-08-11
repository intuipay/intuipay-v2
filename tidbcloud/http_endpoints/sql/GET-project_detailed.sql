USE test;

SELECT `p`.`id`,`project_name`,`banner`,`status`,
  `campaign`,`category`,`location`,`type`,`accepts`,`tags`,`p`.`amount`,`goal_amount`,
  `end_at`,`p`.`email`,`website`,`github`,`org_name`,`org_slug`,`project_subtitle`,
  `org_description`,`org_type`,`org_contact`,`org_location`,`org_website`,
  `org_logo`,`banners`,`backers`,`o`.`email` as `org_email`,
  `org_title`,p.`social_links`,`o`.`social_links` as `org_social_links`,
  `networks`,`tokens`,`wallets`,`o`.`networks` as `org_networks`,
  `o`.`tokens` as `org_tokens`,`o`.`wallets` as `org_wallets`,
  IF(
    COUNT(r.id) = 0,
    JSON_ARRAY(), 
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', r.`id`,
        'title', r.`title`,
        'description', r.`description`,
        'amount', r.`amount`,
        'image', r.`image`,
        'number', r.`number`,
        'count', r.`count`,
        'year', r.`year`,
        'month', r.`month`,
        'ship_method', r.`ship_method`,
        'destinations', r.`destinations`,
        'address', r.`address`
      )
    )
  ) AS rewards
FROM `donation_project` p
  LEFT JOIN `organization` o
    ON `p`.`org_id`=`o`.`id`
  LEFT JOIN `project_reward` r
    ON `p`.`id`=`r`.`project_id`
WHERE `p`.`deleted_at` IS NULL
  AND `o`.`deleted_at` IS NULL
  AND IF(LENGTH(${slug}), `p`.`project_slug` = ${slug}, 1)
  AND IF(LENGTH(${id}), `p`.`id` = ${id}, `p`.`status` = 10)
GROUP BY `p`.`id`, `o`.`id`;