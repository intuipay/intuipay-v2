USE test;

SELECT `p`.`id`,`project_name`,`project_slug`,`banner`,`goal_amount`,
  `amount`,`end_at`,`org_name`,`org_logo`,`org_slug`,`project_subtitle`
FROM `donation_project` p
  LEFT JOIN `organization` o
  ON `p`.`org_id`=`o`.`id`
WHERE `status`=10 AND `p`.`deleted_at` IS NULL
  AND `o`.`deleted_at` IS NULL
  AND `is_widget`=${is_widget}
  AND IF(LENGTH(${search}) > 0, `project_name` LIKE ${search}, 1)
  AND IF(${category} > 0, `category` = ${category}, 1)
  AND IF(LENGTH(${location}) > 0, `location` = ${location}, 1)
  AND IF(${accepts} > 0, `accepts` = ${accepts}, 1)
  AND IF(${type} > 0, `type` = ${type}, 1)
  AND IF(${progress}, `amount` / `goal_amount` > ${progress}, 1)
  AND IF(${excludes} > 0, `p`.`id`!= (${excludes}), 1)
ORDER BY ${order_by}, ${order_dir}
LIMIT ${start}, ${pagesize};