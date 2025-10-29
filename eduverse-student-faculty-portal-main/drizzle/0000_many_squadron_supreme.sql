CREATE TABLE `timetable` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day` text NOT NULL,
	`time` text NOT NULL,
	`subject` text NOT NULL,
	`faculty` text NOT NULL,
	`room` text NOT NULL,
	`type` text NOT NULL,
	`created_at` text NOT NULL
);
