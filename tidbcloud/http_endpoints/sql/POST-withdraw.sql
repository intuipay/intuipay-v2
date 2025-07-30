USE `test`;

INSERT `org_withdraw_log`
(`org_id`,`project_id`,`amount`,`to_wallet`,`status`,
  `network`,`source_wallet`)
VALUES (${org_id},${project_id},${amount},${to_wallet},${status},
  ${network},${source_wallet});