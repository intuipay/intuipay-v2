USE `test`;

INSERT INTO `organization`
(`org_name`,`org_slug`,`org_logo`,`org_type`,`email`)
VALUES(${org_name},${org_slug},${org_logo},150,${email});

SELECT
  LAST_INSERT_ID() AS last_insert_id; 