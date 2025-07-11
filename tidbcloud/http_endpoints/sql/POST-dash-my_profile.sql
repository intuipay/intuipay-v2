USE `test`;

INSERT INTO `user_profile`
(`user_id`, `location`, `timezone`, `bio`, `social_links`, 
  `number`, `display_name`,`display_image`)
VALUES (${user_id}, ${location}, ${timezone}, ${bio}, ${social_links}, 
  ${number}, ${display_name}, ${display_image})
ON DUPLICATE KEY UPDATE
  `location`=${location},
  `timezone`=${timezone},
  `bio`=${bio},
  `social_links`=${social_links},
  `number`=${number},
  `display_name`=${display_name},
  `display_image`=${display_image};