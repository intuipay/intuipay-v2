USE `test`;

SELECT `project_id`,`amount`,`count`,`crypto`,`cash`
FROM `org_donation_project_daily_stat`
WHERE `org_id`=${org_id}
  AND `date`>=${start_date}
  AND `date`<=${end_date};