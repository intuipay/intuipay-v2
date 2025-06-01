USE test;
SELECT * 
FROM `donation_project` 
WHERE `project_slug` = ${slug}
LIMIT 1;