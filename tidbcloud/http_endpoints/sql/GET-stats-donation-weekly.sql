USE `test`;

-- 开启事务
START TRANSACTION;

-- --- 步骤 1: 定义上一个完整周的起止日期 ---
-- DAYOFWEEK() 函数默认周日=1, 周一=2...
-- 我们计算上周一 (今天往前推 7 天，再调整到周一) 和上周日 (今天往前推 1 天)
SET @last_week_start = DATE_SUB(CURDATE(), INTERVAL (DAYOFWEEK(CURDATE()) + 5) DAY);
SET @last_week_end = DATE_SUB(CURDATE(), INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY);


-- --- 步骤 2: 聚合上周的每日数据并插入到周统计表 ---
-- 使用 LEFT JOIN 来检查是否已存在该周期的记录，避免重复插入
INSERT INTO `org_donation_weekly_stat` (`org_id`, `amount`, `count`, `start_date`, `end_date`)
SELECT
    daily.org_id,
    SUM(daily.amount) AS total_amount,
    SUM(daily.count) AS total_count,
    @last_week_start,
    @last_week_end
FROM
    `org_donation_daily_stat` AS daily
LEFT JOIN
    `org_donation_weekly_stat` AS weekly
    ON daily.org_id = weekly.org_id AND weekly.start_date = @last_week_start
WHERE
    daily.date BETWEEN @last_week_start AND @last_week_end
    AND weekly.id IS NULL -- 关键：只选择尚未被插入的组织的统计数据
GROUP BY
    daily.org_id;

-- 提交事务
COMMIT;
