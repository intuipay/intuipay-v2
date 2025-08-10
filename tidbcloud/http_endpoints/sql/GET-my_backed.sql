USE `test`;

SELECT
    dp.id,
    dp.project_name,
    dp.project_slug,
    dp.banner,
    dp.goal_amount,
    dp.amount,
    dp.end_at,
    o.org_name,
    o.org_logo,
    o.org_slug,
    dp.project_subtitle,
    dp.status,
    dp.campaign_id,
    r.created_at AS refund_at
FROM
    donation d
JOIN
    donation_project dp ON d.project_id = dp.id
LEFT JOIN
    organization o ON dp.org_id = o.id
LEFT JOIN
    project_refund r ON dp.id = r.project_id AND r.user_id = d.user_id
WHERE
    d.user_id = ${user_id} AND d.project_id=${project_id}
GROUP BY
    dp.id, o.id;
