USE `test`;

SELECT `project_id`,s.`amount`,`count`,`crypto`,`cash`,`project_name`,
  `date`
FROM `org_donation_project_daily_stat` s
  LEFT JOIN `donation_project` p
    ON s.`project_id`=p.`id`
WHERE s.`org_id`=${org_id}
  AND IF(LENGTH(${project_id}) > 0, `project_id` = ${project_id}, 1)
  AND `date`>=${start_date}
  AND `date`<=${end_date};