CREATE TABLE `studentExamResult` (
	`id` text PRIMARY KEY NOT NULL,
	`examId` text NOT NULL,
	`studentId` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`score` integer,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE no action
);
