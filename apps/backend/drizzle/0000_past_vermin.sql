CREATE TABLE `class` (
	`id` text PRIMARY KEY NOT NULL,
	`schoolId` text NOT NULL,
	`grade` integer NOT NULL,
	`section` text NOT NULL,
	`sectionTeacherId` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `examCheatLog` (
	`id` text PRIMARY KEY NOT NULL,
	`timestamp` text NOT NULL,
	`studentExamResultId` text NOT NULL,
	`note` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exam` (
	`id` text PRIMARY KEY NOT NULL,
	`grade` integer NOT NULL,
	`subjectId` text NOT NULL,
	`topic` text,
	`title` text,
	`date` text,
	`location` text,
	`duration` text NOT NULL,
	`variation` text,
	`testIds` text,
	`openExerciseIds` text,
	`notes` text,
	`score` integer,
	`usageCount` integer DEFAULT 0 NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `openExercies` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`question` text,
	`answer` text,
	`imageUrl` text,
	`difficulty` text,
	`score` integer NOT NULL,
	`notes` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `school` (
	`id` text PRIMARY KEY NOT NULL,
	`clerkId` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`register` integer NOT NULL,
	`address` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `studentExamResult` (
	`id` text PRIMARY KEY NOT NULL,
	`examId` text NOT NULL,
	`studentId` text NOT NULL,
	`teacherId` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`testScore` integer,
	`openExerciseScore` integer,
	`totalScore` integer,
	`actualScore` integer,
	`examCheatLogIds` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `student` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`classId` text NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`studentCode` text,
	`studentExamResultIds` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
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
	`clerkId` text,
	`email` text NOT NULL,
	`classId` text,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`schoolId` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `test` (
	`id` text PRIMARY KEY NOT NULL,
	`grade` integer,
	`subjectId` text,
	`question` text NOT NULL,
	`answers` text NOT NULL,
	`imageUrl` text,
	`rightAnswer` text NOT NULL,
	`difficulty` text NOT NULL,
	`score` integer NOT NULL,
	`usageCount` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
