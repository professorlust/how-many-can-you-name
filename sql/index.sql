CREATE TABLE `howmany` (
  `quiz_id` int(10) NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(100) NOT NULL,
  `started` int(10) NOT NULL DEFAULT 0,
  `count` int(10) NOT NULL,
  `all_correct` INT NOT NULL,
  `max` FLOAT NOT NULL,
  `median` FLOAT NOT NULL,
  `mode` FLOAT NOT NULL,
  `mean` FLOAT NOT NULL,
  `non_zero_mean` FLOAT NOT NULL,
  `create_date` DATE NOT NULL,
INDEX `SLUG` (`slug`),
UNIQUE `INDEX` (`quiz_id`)) ENGINE=InnoDB;
