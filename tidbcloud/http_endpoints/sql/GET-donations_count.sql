USE `test`;

SELECT COUNT('x') AS `total`
FROM `donation` d
  LEFT JOIN `donation_project` dp
    ON d.`project_id`=dp.`id`
WHERE `org_id`=${org_id}
  AND IF(LENGTH(${project_id}) > 0, `project_id`=${project_id}, 1)
  AND IF(LENGTH(${start_date}) > 0, d.`created_at`>=${start_date}, 1)
  AND IF(LENGTH(${end_date}) > 0, d.`created_at`<${end_date}, 1);