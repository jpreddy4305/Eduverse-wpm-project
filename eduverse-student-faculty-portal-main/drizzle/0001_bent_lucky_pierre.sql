CREATE TABLE `assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`subject` text NOT NULL,
	`faculty_name` text NOT NULL,
	`due_date` text NOT NULL,
	`total_marks` integer NOT NULL,
	`department` text NOT NULL,
	`year` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`author` text NOT NULL,
	`author_role` text NOT NULL,
	`department` text NOT NULL,
	`priority` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`subject` text NOT NULL,
	`uploaded_by` text NOT NULL,
	`upload_date` text NOT NULL,
	`url` text NOT NULL,
	`department` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assignment_id` integer NOT NULL,
	`student_id` text NOT NULL,
	`student_name` text NOT NULL,
	`submitted_date` text NOT NULL,
	`file_url` text,
	`grade` integer,
	`feedback` text,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
