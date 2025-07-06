USE test;

SELECT COUNT('x') AS total
FROM donation_project
WHERE `status`=1 AND `deleted_at` IS NULL
  AND `is_widget`=${is_widget}
  AND IF(LENGTH(${search}) > 0, `project_name` LIKE ${search}, 1)
  AND IF(${category} > 0, `category` = ${category}, 1)
  AND IF(LENGTH(${location}) > 0, `location` = ${location}, 1)
  AND IF(${accepts} > 0, `accepts` = ${accepts}, 1)
  AND IF(${type} > 0, `type` = ${type}, 1)
  AND IF(${progress}, `amount` / `goal_amount` > ${progress}, 1)