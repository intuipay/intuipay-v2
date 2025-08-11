USE `test`;

INSERT INTO `donation_project`
(
  `project_name`, `project_subtitle`, `project_slug`,
  `category`,`type`,`location`,`banner`,`video`,`social_links`,
  `campaign`,`tags`,`goal_amount`,`end_at`,`accepts`,`org_id`,
  `status`,`is_auto_end`,`networks`,`tokens`,`wallets`,
  `campaign_id`,`create_tx_hash`
)
VALUES (
  ${name},${subtitle},${slug},
  ${category},${type},${location},${banner},${video},${social_links},
  ${campaign},${tags},${goal_amount},${end_at},${accepts},${org_id},
  ${status},${is_auto_end},${networks},${tokens},${wallets},
  ${campaign_id},${create_tx_hash}
);

SELECT LAST_INSERT_ID() as id;