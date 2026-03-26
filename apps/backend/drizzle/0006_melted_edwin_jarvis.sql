CREATE TABLE `test` (
	`id` text PRIMARY KEY NOT NULL,
	`gradeId` text NOT NULL,
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
	FOREIGN KEY (`gradeId`) REFERENCES `grade`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subjectId`) REFERENCES `subject`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exam` (
	`id` text PRIMARY KEY NOT NULL,
	`notes` text,
	`title` text,
	`duration` text NOT NULL,
	`isActive` integer DEFAULT 1 NOT NULL,
	`variation` text,
	`testIds` text,
	`openExercises` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_exam`("id", "notes", "title", "duration", "isActive", "variation", "testIds", "openExercises", "createdAt", "updatedAt") SELECT "id", "notes", "title", "duration", "isActive", "variation", "testIds", "openExercises", "createdAt", "updatedAt" FROM `exam`;--> statement-breakpoint
DROP TABLE `exam`;--> statement-breakpoint
ALTER TABLE `__new_exam` RENAME TO `exam`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_grade` (
	`id` text PRIMARY KEY NOT NULL,
	`grade` integer,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_grade`("id", "grade", "createdAt", "updatedAt") SELECT "id", "grade", "createdAt", "updatedAt" FROM `grade`;--> statement-breakpoint
DROP TABLE `grade`;--> statement-breakpoint
ALTER TABLE `__new_grade` RENAME TO `grade`;