USE test;

SELECT first_name, last_name, amount, currency, country, `method`
FROM `donation`
WHERE project_id=${project_id}
ORDER BY id DESC
LIMIT ${start}, ${pagesize};