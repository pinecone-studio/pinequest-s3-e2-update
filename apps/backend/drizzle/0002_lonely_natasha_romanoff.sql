CREATE TABLE `examCheatLog` (
	`id` text PRIMARY KEY NOT NULL,
	`examId` text NOT NULL,
	`timestamp` text NOT NULL,
	`studentId` text NOT NULL,
	`tab` text NOT NULL,
	`note` text,
	`teacherId` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exam` (
	`id` text PRIMARY KEY NOT NULL,
	`notes` text,
	`duration` text NOT NULL,
	`isActive` integer DEFAULT 1 NOT NULL,
	`variation` text NOT NULL,
	`tests` text,
	`openExercises` text,
	`gradeId` text,
	`date` text,
	`location` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`gradeId`) REFERENCES `grade`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_exam`("id", "notes", "duration", "isActive", "variation", "tests", "openExercises", "gradeId", "date", "location", "createdAt", "updatedAt") SELECT "id", "notes", "duration", "isActive", "variation", "tests", "openExercises", "gradeId", "date", "location", "createdAt", "updatedAt" FROM `exam`;--> statement-breakpoint
DROP TABLE `exam`;--> statement-breakpoint
ALTER TABLE `__new_exam` RENAME TO `exam`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `grade` ADD `studentIds` text;--> statement-breakpoint
ALTER TABLE `grade` DROP COLUMN `variation`;