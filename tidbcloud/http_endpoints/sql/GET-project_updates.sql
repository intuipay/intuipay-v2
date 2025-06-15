USE test;

SELECT id, title, content, thumbnail, created_at
FROM project_updates
WHERE project_id=${project_id}
  AND IF(LENGTH(${start_date}) > 0, `created_at` >= ${start_date}, 1)
ORDER BY id DESC
LIMIT ${start}, ${pagesize};