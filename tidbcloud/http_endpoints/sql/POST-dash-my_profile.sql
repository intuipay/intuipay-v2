USE `test`;

INSERT INTO `user_profile`
(`user_id`, `location`, `timezone`, `bio`, `social_links`, `number`)
VALUES (${user_id}, ${location}, ${timezone}, ${bio}, ${social_links}, ${number})
ON DUPLICATE KEY UPDATE
  `location`=${location},
  `timezone`=${timezone},
  `bio`=${bio},
  `social_links`=${social_links},
  `number`=${number};