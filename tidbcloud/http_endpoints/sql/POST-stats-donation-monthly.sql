USE `test`;

-- 开启事务
START TRANSACTION;

-- ===================================================================
-- 脚本3: 生成【组织维度】的月统计数据 (org_donation_monthly_stat)
-- ===================================================================
INSERT INTO org_donation_monthly_stat 
  (org_id, start_date, end_date, amount, `count`, cash, crypto)
SELECT
    org_id,
    ${start_date}, -- 传入的月起始日期
    ${end_date},   -- 传入的月结束日期
    SUM(amount) AS total_amount,
    SUM(`count`) AS total_count,
    SUM(cash) AS total_cash,
    SUM(crypto) AS total_crypto
FROM
    org_donation_daily_stat
WHERE
    `date` >= ${start_date} AND `date` <= ${end_date}
GROUP BY
    org_id
ON DUPLICATE KEY UPDATE
    end_date = VALUES(end_date),
    amount = VALUES(amount),
    `count` = VALUES(`count`),
    cash = VALUES(cash),
    crypto = VALUES(crypto);


-- ===================================================================
-- 脚本4: 生成【项目维度】的月统计数据 (org_donation_project_monthly_stat)
-- ===================================================================
INSERT INTO org_donation_project_monthly_stat 
  (org_id, project_id, start_date, end_date, amount, `count`, cash, crypto)
SELECT
    org_id,
    project_id,
    ${start_date}, -- 传入的月起始日期
    ${end_date},   -- 传入的月结束日期
    SUM(amount) AS total_amount,
    SUM(`count`) AS total_count,
    SUM(cash) AS total_cash,
    SUM(crypto) AS total_crypto
FROM
    org_donation_project_daily_stat
WHERE
    `date` >= ${start_date} AND `date` <= ${end_date}
GROUP BY
    org_id, project_id
ON DUPLICATE KEY UPDATE
    end_date = VALUES(end_date),
    amount = VALUES(amount),
    `count` = VALUES(`count`),
    cash = VALUES(cash),
    crypto = VALUES(crypto);

-- 提交事务
COMMIT;
