USE `test`;

SELECT `first_name`,`last_name`,`display_email`,`title`,`issue_id`
FROM `user_profile` p
  LEFT JOIN `user_org_relation` r
    ON p.`user_id`=r.`user_id`
WHERE `permission`=100
  AND `org_id`=${org_id};
