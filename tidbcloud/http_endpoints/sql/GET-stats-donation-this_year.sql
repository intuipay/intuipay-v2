USE `test`;

SELECT
    -- 1. 捐款总额：将所有月份的 amount 加总
    SUM(amount) AS amount,

    -- 2. 捐款笔数：将所有月份的 count 加总
    SUM(`count`) AS count,

    -- 3. 平均每笔捐款金额：总金额 / 总笔数。使用 NULLIF 防止除以零的错误。
    SUM(amount) / NULLIF(SUM(`count`), 0) AS average
FROM
    org_donation_monthly_stat
WHERE
    -- 筛选出 start_date 在今年的所有月度记录
    -- YEAR(CURDATE()) 会根据当前日期自动获取年份，即 2025 年
    YEAR(start_date) = YEAR(CURDATE())
  AND `org_id`=${org_id};