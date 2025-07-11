USE `test`;

SELECT `location`,`timezone`,`bio`,`social_links`,`number`,`display_name`,`display_image`
FROM `user_profile`
WHERE `user_id`=${user_id};