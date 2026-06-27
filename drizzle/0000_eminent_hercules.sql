CREATE TABLE `activity_logs` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255),
	`action` varchar(100) NOT NULL,
	`details` text NOT NULL,
	`timestamp` timestamp DEFAULT (now()),
	CONSTRAINT `activity_logs_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`type` varchar(50) NOT NULL DEFAULT 'info',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(255),
	`program` varchar(255) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'draft',
	`submitted_at` timestamp,
	`updated_at` timestamp DEFAULT (now()),
	`birth_place` varchar(255),
	`birth_date` varchar(50),
	`gender` varchar(50),
	`address` text,
	`phone` varchar(50),
	`previous_school` varchar(255),
	`grad_year` varchar(10),
	`major` varchar(255),
	`participant_number` varchar(50),
	`selection_code` varchar(100),
	`score` int,
	`re_registration_paid` boolean DEFAULT false,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`url` text NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`uploaded_at` timestamp DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fee_configs` (
	`id` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `fee_configs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`method` varchar(100) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`category` varchar(100) NOT NULL DEFAULT 'registration',
	`transaction_id` varchar(255) NOT NULL,
	`paid_at` timestamp,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`phone` varchar(50),
	`role` varchar(50) NOT NULL DEFAULT 'applicant',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
