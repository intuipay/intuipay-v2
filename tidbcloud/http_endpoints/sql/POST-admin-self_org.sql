USE `test`;

INSERT INTO `organization`
(`org_name`,`org_slug`,`org_logo`,`org_type`,`email`)
VALUES(${org_name},${org_slug},${org_logo},150,${email});

SET @new_org_id = LAST_INSERT_ID();

INSERT INTO `user_org_relation`
(`org_id`,`user_id`)
VALUES(@new_org_id, ${user_id});

SELECT @new_org_id as last_insert_id;