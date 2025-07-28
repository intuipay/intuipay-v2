USE `test`;

SELECT d.`id`,`dollar`,d.`amount`,`tx_hash`,`currency`,`method`,
  d.`created_at`,d.`status`,`country`,`first_name`,`last_name`,
  `company_name`,`project_name`
FROM `donation` d
  LEFT JOIN `donation_project` dp
    ON d.`project_id`=dp.`id`
WHERE `org_id`=${org_id}
  AND IF(LENGTH(${project_id}) > 0, `project_id`=${project_id}, 1)
  AND IF(LENGTH(${start_date}) > 0, d.`created_at`>=${start_date}, 1)
  AND IF(LENGTH(${end_date}) > 0, d.`created_at`<${end_date}, 1)
ORDER BY
  -- 按金额 (amount) 排序
  CASE WHEN ${sort_key} = 'amount' AND ${sort_order} = 'ASC' THEN d.amount END ASC,
  CASE WHEN ${sort_key} = 'amount' AND ${sort_order} = 'DESC' THEN d.amount END DESC,
  
  -- 按交易哈希 (tx_hash) 排序
  CASE WHEN ${sort_key} = 'tx_hash' AND ${sort_order} = 'ASC' THEN d.tx_hash END ASC,
  CASE WHEN ${sort_key} = 'tx_hash' AND ${sort_order} = 'DESC' THEN d.tx_hash END DESC,
  
  -- 按创建时间 (created_at) 排序
  CASE WHEN ${sort_key} = 'created_at' AND ${sort_order} = 'ASC' THEN d.created_at END ASC,
  CASE WHEN ${sort_key} = 'created_at' AND ${sort_order} = 'DESC' THEN d.created_at END DESC,
  
  -- 默认排序: 当以上条件都不满足时，默认按创建时间倒序排列
  d.`id` DESC
LIMIT ${start}, ${pagesize};