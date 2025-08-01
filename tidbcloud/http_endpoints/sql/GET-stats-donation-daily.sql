USE `test`;

SELECT `amount`,`count`,`crypto`,`cash`,`date`
FROM `org_donation_daily_stat`
WHERE `org_id`=${org_id} 
  AND `date`>=${start_date}
  AND `date`<=${end_date};