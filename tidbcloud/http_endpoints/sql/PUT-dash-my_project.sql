USE `test`;

UPDATE `donation_project`
SET `project_name`=${name},`project_slug`=${slug}
WHERE `id`=${id};