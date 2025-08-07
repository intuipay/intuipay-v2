USE `test`;

INSERT INTO `project_updates`
  (`project_id`, `title`, `content`, `thumbnail`, `status`)
SELECT
  dp.id,
  ${title},
  ${content},
  ${thumbnail},
  1
FROM
  `donation_project` dp
INNER JOIN
  `user_org_relation` uor ON dp.org_id = uor.org_id
WHERE
  dp.id = ${project_id} 
  AND dp.org_id IS NOT NULL
  AND uor.user_id = ${user_id};