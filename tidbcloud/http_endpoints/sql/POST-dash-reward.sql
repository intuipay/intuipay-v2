USE `test`;

INSERT INTO `project_reward`
(
  `project_id`,`reward_type`,`title`,`description`,`amount`,`images`,
  `number`,`month`,`year`,`ship_method`,`destinations`,`address`
)
VALUES (
  ${project_id},${reward_type},${title},${description},${amount},${images},
  ${number},${month},${year},${ship_method},${destinations},${address}
);

SELECT LAST_INSERT_ID() as id;