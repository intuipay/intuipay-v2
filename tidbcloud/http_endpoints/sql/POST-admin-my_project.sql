USE `test`;

INSERT INTO `donation_project`
(
  `project_name`, `project_subtitle`, `project_slug`,
  `category`,`type`,`location`,`banner`,`video`,`social_links`,
  `campaign`,`tags`,`goal_amount`,`end_at`,`accepts`,`org_id`,
  `status`,`is_auto_end`
)
VALUES (
  ${name},${subtitle},${slug},
  ${category},${type},${location},${banner},${video},${social_links},
  ${campaign},${tags},${goal_amount},${end_at},${accepts},${org_id},
  10,${is_auto_end}
)