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
    -- 筛选出机构 ID
    `org_id` = ${org_id}
    -- 并且，筛选出 start_date 在动态时间范围内的所有月度记录
    AND `start_date` >=
        -- 使用 CASE 语句根据 ${range} 参数动态确定起始日期
        CASE
            -- 如果 ${range}='quarter'，则起始日期为本季度的第一天
            WHEN ${range} = 'quarterly' THEN DATE_ADD(MAKEDATE(YEAR(CURDATE()), 1), INTERVAL QUARTER(CURDATE()) - 1 QUARTER)

            -- 如果 ${range}='year'，则起始日期为本年的第一天
            WHEN ${range} = 'yearly' THEN MAKEDATE(YEAR(CURDATE()), 1)

            -- 其他情况 (包括 ${range}='month'、为 NULL 或为空字符串)，起始日期都为本月的第一天
            ELSE DATE_FORMAT(CURDATE(), '%Y-%m-01')
        END;