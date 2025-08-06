USE `test`;

START TRANSACTION;

INSERT INTO `organization`
(`org_name`,`org_slug`,`org_type`)
VALUES (
  ${org_name},${org_slug},150
);

SET @org_id = LAST_INSERT_ID();

INSERT INTO `user_org_relation`
(`user_id`,`org_id`,`permission`)
VALUES (${user_id}, @org_id, 150);

COMMIT;

SELECT @org_id as id;