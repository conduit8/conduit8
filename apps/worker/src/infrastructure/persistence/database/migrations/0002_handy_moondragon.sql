CREATE TABLE `user_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`feedback_type` text,
	`follow_up_email` text,
	`platform_user_id` text NOT NULL,
	`team_id` text NOT NULL,
	`platform` text DEFAULT 'slack' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `feedback_user_idx` ON `user_feedback` (`platform_user_id`);--> statement-breakpoint
CREATE INDEX `feedback_team_idx` ON `user_feedback` (`team_id`);--> statement-breakpoint
CREATE INDEX `feedback_type_idx` ON `user_feedback` (`feedback_type`);--> statement-breakpoint
CREATE INDEX `feedback_created_at_idx` ON `user_feedback` (`created_at`);