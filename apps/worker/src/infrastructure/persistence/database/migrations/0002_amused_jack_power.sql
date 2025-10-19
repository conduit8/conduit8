ALTER TABLE `skills` ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `skills_slug_unique` ON `skills` (`slug`);