CREATE TABLE `brackets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `competitors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bracketId` integer,
	`name` text NOT NULL,
	`elo` real NOT NULL,
	FOREIGN KEY (`bracketId`) REFERENCES `brackets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bracketId` integer,
	`competitorAId` integer,
	`competitorBId` integer,
	`outcome` text NOT NULL,
	`notes` text NOT NULL,
	FOREIGN KEY (`bracketId`) REFERENCES `brackets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`competitorAId`) REFERENCES `competitors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`competitorBId`) REFERENCES `competitors`(`id`) ON UPDATE no action ON DELETE no action
);
