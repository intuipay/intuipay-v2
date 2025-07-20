USE `test`;

-- ########## 每月捐赠统计脚本 ##########
-- 建议运行时间：每月第一天的凌晨

-- 开启事务
START TRANSACTION;

-- --- 步骤 1: 定义上一个完整月的起止日期 ---
SET @last_month_start = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01');
SET @last_month_end = LAST_DAY(CURDATE() - INTERVAL 1 MONTH);


-- --- 步骤 2: 聚合上个月的每日数据并插入到月统计表 ---
-- 同样使用 LEFT JOIN 避免重复插入
INSERT INTO `org_donation_monthly_stat` (`org_id`, `amount`, `count`, `start_date`, `end_date`)
SELECT
    daily.org_id,
    SUM(daily.amount) AS total_amount,
    SUM(daily.count) AS total_count,
    @last_month_start,
    @last_month_end
FROM
    `org_donation_daily_stat` AS daily
LEFT JOIN
    `org_donation_monthly_stat` AS monthly
    ON daily.org_id = monthly.org_id AND monthly.start_date = @last_month_start
WHERE
    daily.date BETWEEN @last_month_start AND @last_month_end
    AND monthly.id IS NULL -- 关键：只选择尚未被插入的组织的统计数据
GROUP BY
    daily.org_id;

-- 提交事务
COMMIT;
