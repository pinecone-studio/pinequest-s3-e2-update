PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_class` (
	`id` text PRIMARY KEY NOT NULL,
	`schoolId` text,
	`grade` text,
	`teacherId` text,
	`studentIds` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_class`("id", "schoolId", "grade", "teacherId", "studentIds", "createdAt", "updatedAt") SELECT "id", "schoolId", "grade", "teacherId", "studentIds", "createdAt", "updatedAt" FROM `class`;--> statement-breakpoint
DROP TABLE `class`;--> statement-breakpoint
ALTER TABLE `__new_class` RENAME TO `class`;--> statement-breakpoint
PRAGMA foreign_keys=ON;