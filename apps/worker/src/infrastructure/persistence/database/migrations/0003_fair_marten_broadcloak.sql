PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`zip_key` text NOT NULL,
	`image_key` text NOT NULL,
	`examples` text NOT NULL,
	`curator_note` text,
	`author` text NOT NULL,
	`author_kind` text NOT NULL,
	`source_type` text NOT NULL,
	`source_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_skills`("id", "slug", "name", "description", "category", "zip_key", "image_key", "examples", "curator_note", "author", "author_kind", "source_type", "source_url", "created_at", "updated_at") SELECT "id", "slug", "name", "description", "category", "zip_key", "image_key", "examples", "curator_note", "author", "author_kind", "source_type", "source_url", "created_at", "updated_at" FROM `skills`;--> statement-breakpoint
DROP TABLE `skills`;--> statement-breakpoint
ALTER TABLE `__new_skills` RENAME TO `skills`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `skills_slug_unique` ON `skills` (`slug`);