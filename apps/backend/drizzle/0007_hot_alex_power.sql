DROP TABLE `grade`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_student` (
	`id` text PRIMARY KEY NOT NULL,
	`schoolId` text NOT NULL,
	`grade` integer,
	`name` text NOT NULL,
	`studentCode` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_student`("id", "schoolId", "grade", "name", "studentCode", "createdAt", "updatedAt") SELECT "id", "schoolId", "grade", "name", "studentCode", "createdAt", "updatedAt" FROM `student`;--> statement-breakpoint
DROP TABLE `student`;--> statement-breakpoint
ALTER TABLE `__new_student` RENAME TO `student`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_test` (
	`id` text PRIMARY KEY NOT NULL,
	`grade` integer,
	`subjectId` text NOT NULL,
	`topic` text NOT NULL,
	`title` text,
	`question` text NOT NULL,
	`answers` text NOT NULL,
	`rightAnswer` text NOT NULL,
	`notes` text,
	`questionNote` text,
	`difficulty` text,
	`score` integer NOT NULL,
	`isActive` integer DEFAULT 1 NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`subjectId`) REFERENCES `subject`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_test`("id", "grade", "subjectId", "topic", "title", "question", "answers", "rightAnswer", "notes", "questionNote", "difficulty", "score", "isActive", "createdAt", "updatedAt") SELECT "id", "grade", "subjectId", "topic", "title", "question", "answers", "rightAnswer", "notes", "questionNote", "difficulty", "score", "isActive", "createdAt", "updatedAt" FROM `test`;--> statement-breakpoint
DROP TABLE `test`;--> statement-breakpoint
ALTER TABLE `__new_test` RENAME TO `test`;