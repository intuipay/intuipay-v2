USE `test`;

UPDATE `project_reward` r
  LEFT JOIN `donation_project` p
    ON r.`project_id`=p.`id`
SET r.`title`=${title},
  r.`description`=${description},
  r.`amount`=${amount},
  r.`images`=${images},
  r.`number`=${number},
  r.`month`=${month},
  r.`year`=${year},
  r.`ship_method`=${ship_method},
  r.`destinations`=${destinations},
  r.`address`=${address}
WHERE r.`id`=${id}
  AND p.`status`<10;