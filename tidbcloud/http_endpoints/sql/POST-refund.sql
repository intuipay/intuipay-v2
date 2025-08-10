USE `test`;

START TRANSACTION;

SET @user_id_to_refund=${user_id};
SET @project_id_to_refund=${project_id};

-- 步骤 1: 创建一条汇总的退款记录
-- 我们使用 INSERT ... SELECT 语句，从 donation 表中直接计算总金额并插入到 project_refund 表。
-- 这个操作是幂等的（idempotent），因为 project_refund 表上的 (project_id, user_id) 唯一键约束
-- 会阻止为同一个用户和项目创建重复的退款记录。如果记录已存在，此 INSERT 将失败，整个事务将回滚。
-- 额外条件：
-- 1. 检查 `donation_project.status = 50`，确保项目是失败状态。
-- 2. 检查 `donation.refund_at IS NULL`，确保我们只汇总尚未退款的捐赠。
-- 3. 使用 `HAVING SUM(d.dollar) > 0` 来避免创建金额为 0 的无效退款记录。
INSERT INTO project_refund 
  (project_id, user_id, amount, status)
SELECT
    d.project_id,
    d.user_id,
    SUM(d.dollar),
    2
FROM
    donation d
JOIN
    donation_project p ON d.project_id = p.id
WHERE
    d.user_id = @user_id_to_refund
    AND d.project_id = @project_id_to_refund
    AND p.status = 50
    AND d.refund_at IS NULL
GROUP BY
    d.project_id, d.user_id
HAVING
    SUM(d.dollar) > 0;

SET @id=LAST_INSERT_ID();

-- 步骤 2: 更新相关的捐赠记录，标记为已退款
-- 只有在上面的 INSERT 成功执行后，才会执行这一步。
-- 我们将 refund_at 字段更新为当前时间，这明确地表示这些捐赠已被处理。
-- WHERE 子句中的条件与步骤 1 完全相同，以确保数据的一致性。
UPDATE
    donation d
JOIN
    donation_project p ON d.project_id = p.id
SET
    d.refund_at = NOW()
WHERE
    d.user_id = @user_id_to_refund
    AND d.project_id = @project_id_to_refund
    AND p.status = 50
    AND d.refund_at IS NULL;

COMMIT;

SELECT @id as refund_id;