USE `test`;

-- 设置目标日期为“昨天”，方便脚本复用
SET @target_date = CURDATE() - INTERVAL 1 DAY;

-- 开启事务，确保所有操作的原子性
START TRANSACTION;

-- --------------------------------------------------------------------------------
-- 核心查询逻辑 (定义在下面的派生表中):
-- 这个子查询的逻辑被重复使用了三次，每次都作为一个临时的派生表。
-- --------------------------------------------------------------------------------


-- 步骤 1: 将捐赠收入记录插入余额日志表 (org_balance_log)
INSERT INTO `org_balance_log` (`org_id`, `amount`, `in_out`, `reason`, `created_at`)
SELECT
    DailyStats.org_id,
    DailyStats.total_amount,
    1, -- 收入
    1, -- 原因：捐赠
    NOW()
FROM (
    -- 这是第一个派生表，用于计算统计数据
    SELECT
        dp.org_id,
        SUM(d.dollar) AS total_amount
    FROM
        donation AS d
    JOIN
        donation_project AS dp ON d.project_id = dp.id
    LEFT JOIN
        org_donation_daily_stat AS stat ON dp.org_id = stat.org_id AND stat.date = @target_date
    WHERE
        d.status = 1
        AND DATE(d.created_at) = @target_date
        AND stat.id IS NULL
    GROUP BY
        dp.org_id
    HAVING
        SUM(d.dollar) > 0
) AS DailyStats;


-- 步骤 2: 将每日统计数据插入每日捐赠统计表 (org_donation_daily_stat)
INSERT INTO `org_donation_daily_stat` (`org_id`, `amount`, `date`, `count`)
SELECT
    DailyStats.org_id,
    DailyStats.total_amount,
    @target_date,
    DailyStats.total_count
FROM (
    -- 这是第二个派生表，逻辑与第一个几乎完全相同
    SELECT
        dp.org_id,
        SUM(d.dollar) AS total_amount,
        COUNT(d.id) AS total_count
    FROM
        donation AS d
    JOIN
        donation_project AS dp ON d.project_id = dp.id
    LEFT JOIN
        org_donation_daily_stat AS stat ON dp.org_id = stat.org_id AND stat.date = @target_date
    WHERE
        d.status = 1
        AND DATE(d.created_at) = @target_date
        AND stat.id IS NULL
    GROUP BY
        dp.org_id
    HAVING
        SUM(d.dollar) > 0
) AS DailyStats;


-- 步骤 3: 更新 organization 表中每个组织的余额 (balance)
UPDATE
    `organization` AS o
JOIN (
    -- 这是第三个派生表
    SELECT
        dp.org_id,
        SUM(d.dollar) AS total_amount
    FROM
        donation AS d
    JOIN
        donation_project AS dp ON d.project_id = dp.id
    LEFT JOIN
        org_donation_daily_stat AS stat ON dp.org_id = stat.org_id AND stat.date = @target_date
    WHERE
        d.status = 1
        AND DATE(d.created_at) = @target_date
        AND stat.id IS NULL
    GROUP BY
        dp.org_id
    HAVING
        SUM(d.dollar) > 0
) AS DailyStats ON o.id = DailyStats.org_id
SET
    o.balance = o.balance + DailyStats.total_amount;


-- 提交事务，应用所有更改
COMMIT;