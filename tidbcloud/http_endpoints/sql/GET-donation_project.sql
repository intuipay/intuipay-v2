USE `test`;

SELECT p.`id`, `project_slug`, `project_name`, `banner`, `accepts`, `project_cta`,
  `thanks_note`, o.`networks`, o.`tokens`, o.`wallets`
FROM `donation_project` p
  LEFT JOIN `organization` o
    ON p.`org_id`=o.`id`
WHERE p.`deleted_at` IS NULL
  AND o.`deleted_at` IS NULL
  AND (`project_slug` = ${slug}
    OR p.`id`=${id})
LIMIT 1;