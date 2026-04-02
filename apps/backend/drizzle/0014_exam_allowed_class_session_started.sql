ALTER TABLE `exam_allowed_class` ADD `sessionStartedAt` text;
UPDATE `exam_allowed_class` SET `sessionStartedAt` = `createdAt` WHERE `sessionStartedAt` IS NULL;
