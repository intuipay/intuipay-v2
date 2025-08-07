USE `test`;

UPDATE `donation`
SET `refund_at`=now(),`status`=5,`refund_tx_hash`=${refund_hash}
WHERE `id`=${id};