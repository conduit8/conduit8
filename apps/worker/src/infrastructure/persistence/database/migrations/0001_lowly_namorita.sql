CREATE TABLE `skill_stats` (
	`skill_id` text PRIMARY KEY NOT NULL,
	`download_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`category` text,
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
