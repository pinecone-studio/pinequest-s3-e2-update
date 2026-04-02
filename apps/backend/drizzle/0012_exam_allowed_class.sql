CREATE TABLE `exam_allowed_class` (
	`examId` text NOT NULL,
	`classId` text NOT NULL,
	`createdAt` text NOT NULL,
	PRIMARY KEY(`examId`, `classId`)
);
