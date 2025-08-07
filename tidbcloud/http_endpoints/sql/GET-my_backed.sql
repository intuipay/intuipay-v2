USE `test`;

SELECT `id`,`project_name`,`project_slug`,`banner`,`goal_amount`,
  `amount`,`end_at`,`org_name`,`org_logo`,`org_slug`,`project_subtitle`,
  dp.`status`
FROM `donation` d
  LEFT JOIN `donation_project` dp
    ON d.`project_id`=dp.`id`
  LEFT JOIN `organization` o
    ON `dp`.`org_id`=`o`.`id`
WHERE dp.`wallet_address`=${address};
