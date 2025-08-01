USE `test`;

SELECT `project_id`,s.`amount`,`count`,`crypto`,`cash`,`project_name`,
  `start_date`,`end_date`
FROM `org_donation_project_monthly_stat` s
  LEFT JOIN `donation_project` p
    ON s.`project_id`=p.`id`
WHERE s.`org_id`=${org_id}
  AND IF(LENGTH(${project_id}) > 0, `project_id` = ${project_id}, 1)
  AND `start_date`>=${start_date}
  AND `end_date`<=${end_date};