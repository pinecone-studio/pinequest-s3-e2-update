ALTER TABLE `exam` ADD `isActive` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `exam` ADD `needpermission` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
-- openExercies scoping fields are already present on remote D1.