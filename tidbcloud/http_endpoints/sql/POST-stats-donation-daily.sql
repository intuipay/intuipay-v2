USE `test`;

-- 设置目标日期为“昨天”，方便脚本复用
SET @target_date = CURDATE() - INTERVAL 1 DAY;

-- 开启事务以确保数据一致性
START TRANSACTION;

-- 任务7: 按项目统计并插入到 org_donation_project_daily_stat 表
-- 首先，我们计算昨天每个项目收到的捐赠详情。
INSERT INTO org_donation_project_daily_stat 
  (org_id, project_id, `date`, amount, `count`, cash, crypto)
SELECT
    dp.org_id,
    d.project_id,
    @target_date,
    SUM(d.dollar) AS total_amount,
    COUNT(d.id) AS donation_count,
    SUM(CASE WHEN d.method = 2 THEN d.dollar ELSE 0 END) AS cash_amount,
    SUM(CASE WHEN d.method = 1 THEN d.dollar ELSE 0 END) AS crypto_amount
FROM
    donation AS d
JOIN
    donation_project AS dp ON d.project_id = dp.id
WHERE
    -- 筛选出昨天的所有捐赠记录
    DATE(d.created_at) = @target_date
GROUP BY
    dp.org_id, d.project_id;


-- 任务5: 按组织统计并插入到 org_donation_daily_stat 表
-- 接下来，我们基于上面的逻辑，按组织维度进行汇总。
INSERT INTO org_donation_daily_stat 
  (org_id, `date`, amount, `count`, cash, crypto)
SELECT
    org_stats.org_id,
    @target_date,
    SUM(org_stats.total_amount) AS org_total_amount,
    SUM(org_stats.donation_count) AS org_total_count,
    SUM(org_stats.cash_amount) AS org_cash_amount,
    SUM(org_stats.crypto_amount) AS org_crypto_amount
FROM (
    -- 使用派生表计算每个项目的昨日捐赠数据
    SELECT
        dp.org_id,
        SUM(d.dollar) AS total_amount,
        COUNT(d.id) AS donation_count,
        SUM(CASE WHEN d.method = 2 THEN d.dollar ELSE 0 END) AS cash_amount,
        SUM(CASE WHEN d.method = 1 THEN d.dollar ELSE 0 END) AS crypto_amount
    FROM
        donation AS d
    JOIN
        donation_project AS dp ON d.project_id = dp.id
    WHERE
        DATE(d.created_at) = @target_date
    GROUP BY
        dp.org_id
) AS org_stats
GROUP BY
    org_stats.org_id;


-- 任务4: 为每个有收入的组织记录一条余额变更日志
INSERT INTO org_balance_log 
  (org_id, amount, in_out, reason, created_at, creator)
SELECT
    org_daily_donations.org_id,
    org_daily_donations.total_daily_amount,
    1, -- 1 代表收入 (in)
    1, -- 1 代表原因为捐赠
    NOW(),
    NULL -- creator 字段留空或根据业务逻辑设置
FROM (
    -- 使用派生表计算每个组织的昨日总捐赠额
    SELECT
        dp.org_id,
        SUM(d.dollar) AS total_daily_amount
    FROM
        donation AS d
    JOIN
        donation_project AS dp ON d.project_id = dp.id
    WHERE
        DATE(d.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    GROUP BY
        dp.org_id
) AS org_daily_donations;


-- 任务6: 更新 organization 表的 balance 字段
UPDATE organization o
JOIN (
    -- 再次使用派生表计算每个组织的昨日总捐赠额
    SELECT
        dp.org_id,
        SUM(d.dollar) AS total_daily_amount
    FROM
        donation AS d
    JOIN
        donation_project AS dp ON d.project_id = dp.id
    WHERE
        DATE(d.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    GROUP BY
        dp.org_id
) AS org_daily_donations ON o.id = org_daily_donations.org_id
SET
    o.balance = o.balance + org_daily_donations.total_daily_amount;


-- 提交事务，完成所有操作
COMMIT;