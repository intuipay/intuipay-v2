USE `test`;

SELECT
    -- 1. 捐款总额：将所有符合条件的月份 amount 加总
    SUM(amount) AS amount,

    -- 2. 捐款笔数：将所有符合条件的月份 count 加总
    SUM(`count`) AS `count`,

    -- 3. 平均每笔捐款金额：总金额 / 总笔数。使用 NULLIF 防止除以零的错误。
    SUM(amount) / NULLIF(SUM(`count`), 0) AS average
FROM
    org_donation_monthly_stat
WHERE
  `org_id` = ${org_id}
  AND `start_date` >=${start_date}
  AND IF(LENGTH(${end_date}) > 0, `end_date`<=${end_date}, 1)