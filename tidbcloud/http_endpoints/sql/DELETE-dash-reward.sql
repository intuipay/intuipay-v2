USE `test`;

DELETE r
FROM `project_reward` r
  LEFT JOIN `donation_project` p
    ON r.`project_id`=p.`id`
WHERE r.`id`=${id}
  AND `p`.`status`<10;