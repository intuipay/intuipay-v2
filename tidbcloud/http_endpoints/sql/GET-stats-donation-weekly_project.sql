USE `test`;

SELECT `project_id`,`amount`,`count`,`crypto`,`cash`
FROM `org_donation_project_weekly_stat`
WHERE `org_id`=${org_id}
  AND `start_date`>=${start_date}
  AND `end_date`>=${end_date};