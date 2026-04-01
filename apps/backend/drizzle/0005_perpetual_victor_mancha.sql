PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_student` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`classId` text NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`studentCode` text,
	`studentExamResultIds` text,
	`studentStatus` text DEFAULT 'active' NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_student`("id", "email", "classId", "firstName", "lastName", "studentCode", "studentExamResultIds", "studentStatus", "createdAt", "updatedAt") SELECT "id", "email", "classId", "firstName", "lastName", "studentCode", "studentExamResultIds", "studentStatus", "createdAt", "updatedAt" FROM `student`;--> statement-breakpoint
DROP TABLE `student`;--> statement-breakpoint
ALTER TABLE `__new_student` RENAME TO `student`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `student_studentCode_unique` ON `student` (`studentCode`);