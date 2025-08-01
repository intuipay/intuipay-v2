USE `test`;

SELECT `p`.*,
  IF(
    COUNT(r.id) = 0, -- 1. 先判断有没有 reward
    JSON_ARRAY(), 
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', r.`id`,
        'title', r.`title`,
        'description', r.`description`,
        'amount', r.`amount`,
        'images', r.`images`,
        'number', r.`number`,
        'count', r.`count`,
        'year', r.`year`,
        'month', r.`month`,
        'ship_method', r.`ship_method`,
        'destinations', r.`destinations`,
        'address', r.`address`
      )
    )
  ) AS rewards
FROM `donation_project` p
  LEFT JOIN `user_org_relation` rel
    ON p.`org_id`=rel.`org_id`
  LEFT JOIN `project_reward` r
    ON p.`id`=r.`project_id`
WHERE p.`deleted_at` IS NULL
  AND p.`id`=${id}
  AND rel.`user_id`=${user_id};