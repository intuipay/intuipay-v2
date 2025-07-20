USE `test`;

SELECT `amount`,`count`,`crypto`,`cash`
FROM `org_donation_monthly_stat`
WHERE `org_id`=${org_id} 
  AND `start_date`>=${start_date}
  AND `end_date`<=${end_date};