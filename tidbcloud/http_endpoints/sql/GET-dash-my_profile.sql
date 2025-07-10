USE `test`;

SELECT `location`,`timezone`,`bio`,`social_links`,`number`
FROM `user_profile`
WHERE `user_id`=${user_id};