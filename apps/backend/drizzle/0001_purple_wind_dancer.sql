CREATE TABLE `class` (
	`id` text PRIMARY KEY NOT NULL,
	`schoolId` text NOT NULL,
	`studentIds` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exam` (
	`id` text PRIMARY KEY NOT NULL,
	`subjectId` text NOT NULL,
	`gradeId` text,
	`teacherId` text,
	`tests` text NOT NULL,
	`openExercises` text NOT NULL,
	`date` text,
	`duration` text NOT NULL,
	`location` text NOT NULL,
	`notes` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`subjectId`) REFERENCES `subject`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`gradeId`) REFERENCES `grade`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `grade` (
	`id` text PRIMARY KEY NOT NULL,
	`variation` text NOT NULL,
	`teacherId` text,
	`subjectId` text NOT NULL,
	`grade` integer,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subjectId`) REFERENCES `subject`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `student` (
	`id` text PRIMARY KEY NOT NULL,
	`schoolId` text NOT NULL,
	`gradeId` text NOT NULL,
	`name` text NOT NULL,
	`studentCode` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`gradeId`) REFERENCES `grade`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subject` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `teacher` (
	`id` text PRIMARY KEY NOT NULL,
	`schoolId` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_school` (
	`id` text PRIMARY KEY NOT NULL,
	`clerkId` text NOT NULL,
	`email` text NOT NULL,
	`address` text NOT NULL,
	`register` integer NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_school`("id", "clerkId", "email", "address", "register", "createdAt", "updatedAt") SELECT "id", "clerkId", "email", "address", "register", "createdAt", "updatedAt" FROM `school`;--> statement-breakpoint
DROP TABLE `school`;--> statement-breakpoint
ALTER TABLE `__new_school` RENAME TO `school`;--> statement-breakpoint
PRAGMA foreign_keys=ON;