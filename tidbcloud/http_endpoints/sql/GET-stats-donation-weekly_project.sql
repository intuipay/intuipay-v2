USE `test`;

SELECT `project_id`,s.`amount`,`count`,`crypto`,`cash`,`project_name`
FROM `org_donation_project_weekly_stat` s
  LEFT JOIN `donation_project` p
    ON s.`project_id`=p.`id`
WHERE s.`org_id`=${org_id}
  AND `start_date`>=${start_date}
  AND `end_date`<=${end_date};