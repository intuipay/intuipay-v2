USE test;

SELECT id, title, content, thumbnail, created_at
FROM project_updates
WHERE project_id=${project_id}
ORDER BY id DESC
LIMIT ${start}, ${pagesize};