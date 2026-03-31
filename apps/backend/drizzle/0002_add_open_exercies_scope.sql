-- Add scoping fields to openExercies rows (subjectId + grade + topic).
-- Required for filtering open exercises by subject & grade in the question bank.

ALTER TABLE `openExercies` ADD COLUMN `subjectId` text;
ALTER TABLE `openExercies` ADD COLUMN `grade` integer;
ALTER TABLE `openExercies` ADD COLUMN `topic` text;
