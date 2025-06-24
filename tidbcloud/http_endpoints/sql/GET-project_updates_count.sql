USE test;

SELECT COUNT('x') AS total
FROM project_updates
WHERE project_id=${project_id}
  AND IF(LENGTH(${start_date}) > 0, `created_at` >= ${start_date}, 1);