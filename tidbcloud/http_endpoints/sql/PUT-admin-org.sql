USE `test`;

UPDATE `organization` o
  LEFT JOIN `user_org_relation` r
    ON o.`id`=r.`org_id`
SET `org_name`=${org_name},`org_slug`=${org_slug}, 
  `org_description`=${description},`org_log`=${logo},
  `org_contact`=${contact},`org_location`=${location},
  `org_website`=${website},`timezone`=${timezone},
  `email`=${email},`social_links`=${social_links}
WHERE o.`id`=${id} AND `user_id`=${user_id};