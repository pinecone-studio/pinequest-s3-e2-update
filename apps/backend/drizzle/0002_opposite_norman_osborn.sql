PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_test` (
	`id` text PRIMARY KEY NOT NULL,
	`grade` integer,
	`subjectId` text,
	`question` text NOT NULL,
	`answers` text,
	`imageUrl` text,
	`rightAnswer` text NOT NULL,
	`difficulty` text NOT NULL,
	`score` integer NOT NULL,
	`usageCount` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`teacherId` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_test`("id", "grade", "subjectId", "question", "answers", "imageUrl", "rightAnswer", "difficulty", "score", "usageCount", "notes", "teacherId", "createdAt", "updatedAt") SELECT "id", "grade", "subjectId", "question", "answers", "imageUrl", "rightAnswer", "difficulty", "score", "usageCount", "notes", "teacherId", "createdAt", "updatedAt" FROM `test`;--> statement-breakpoint
DROP TABLE `test`;--> statement-breakpoint
ALTER TABLE `__new_test` RENAME TO `test`;--> statement-breakpoint
PRAGMA foreign_keys=ON;