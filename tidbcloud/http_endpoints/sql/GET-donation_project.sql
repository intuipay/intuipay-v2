USE test;
SELECT id, project_name, banner, wallet_address, accepts, networks, tokens, wallets 
FROM `donation_project` 
WHERE `project_slug` = ${slug}
LIMIT 1;
