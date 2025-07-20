USE `test`;

-- 开启事务
START TRANSACTION;

-- --- 步骤 1: 定义上一个完整月的起止日期 ---
SET @last_month_start = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01');
SET @last_month_end = LAST_DAY(CURDATE() - INTERVAL 1 MONTH);

-- --- 步骤 2: 聚合上个月的每日数据，并使用 UPSERT 方式插入或更新 ---
INSERT INTO `org_donation_monthly_stat`
    (`org_id`, `amount`, `count`, `start_date`, `end_date`)
SELECT
    daily.org_id,
    SUM(daily.amount) AS total_amount,
    SUM(daily.count) AS total_count,
    @last_month_start,
    @last_month_end
FROM
    `org_donation_daily_stat` AS daily
WHERE
    daily.date BETWEEN @last_month_start AND @last_month_end
GROUP BY
    daily.org_id
ON DUPLICATE KEY UPDATE
    -- 如果 (org_id, start_date) 记录已存在，则用新计算的值覆盖
    amount = VALUES(amount),
    count = VALUES(count),
    end_date = VALUES(end_date);

-- 提交事务
COMMIT;
