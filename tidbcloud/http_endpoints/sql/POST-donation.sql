USE test;
INSERT INTO `donation` 
(`project_id`,`first_name`,`last_name`,`company_name`,`address1`,`address2`,`country`,`state`,`city`,`zip`,`email`,`account`,`currency`,`tx_hash`,`method`,`status`,`has_tax_invoice`,`is_anonymous`,`note`, `amount`, `wallet`, `wallet_address`) 
VALUES(${project_id},${first_name},${last_name},${company_name},${address1},${address2},${country},${state},${city},${zip},${email},${account},${currency},${tx_hash},${method},${status},${has_tax_invoice},${is_anonymous},${note},${amount},${wallet},${wallet_address});

SELECT
  LAST_INSERT_ID() AS last_insert_id;