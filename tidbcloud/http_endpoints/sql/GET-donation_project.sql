USE `test`;

SELECT p.`id`, `project_name`, `banner`, `accepts`,
  `qrcode`, o.`networks`, o.`tokens`, o.`wallets`
FROM `donation_project` p
  LEFT JOIN `organization` o
    ON p.`org_id`=o.`id`
WHERE `project_slug` = ${slug}
LIMIT 1;