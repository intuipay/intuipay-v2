USE `test`;

SELECT `project_id`,s.`amount`,`count`,`crypto`,`cash`
FROM `org_donation_project_daily_stat` s
  LEFT JOIN `donation_project` p
    ON s.`project_id`=p.`id`
WHERE s.`org_id`=${org_id}
  AND `date`>=${start_date}
  AND `date`<=${end_date};