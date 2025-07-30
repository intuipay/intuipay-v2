USE test;

START TRANSACTION;

SET @donation_amount = ${dollar} * 100;

INSERT INTO `donation` 
(`project_id`,`first_name`,`last_name`,`company_name`,`address1`,
  `address2`,`country`,`state`,`city`,`zip`,`email`,`account`,
  `currency`,`tx_hash`,`method`,`status`,`has_tax_invoice`,`dollar`,
  `is_anonymous`,`note`,`amount`,`wallet`,`wallet_address`,`reward_id`) 
VALUES(${project_id},${first_name},${last_name},${company_name},${address1},
  ${address2},${country},${state},${city},${zip},${email},${account},
  ${currency},${tx_hash},${method},${status},${has_tax_invoice},@donation_amount,
  ${is_anonymous},${note},${amount},${wallet},${wallet_address},${reward_id});

SET @new_donation_id = LAST_INSERT_ID();

UPDATE `donation_project`
SET `amount`=`amount`+@donation_amount,
  `backers`=`backers`+1
WHERE `id`=${project_id};

COMMIT;

SELECT @new_donation_id as last_insert_id;
