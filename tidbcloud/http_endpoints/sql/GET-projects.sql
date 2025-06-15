USE test;

SELECT *
FROM `donation_project`
WHERE 1
ORDER BY ${order_by}, ${order_dir}
LIMIT ${start}, ${pagesize};