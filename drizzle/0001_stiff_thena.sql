PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_competitors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bracketId` integer NOT NULL,
	`name` text NOT NULL,
	`elo` real NOT NULL,
	FOREIGN KEY (`bracketId`) REFERENCES `brackets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_competitors`("id", "bracketId", "name", "elo") SELECT "id", "bracketId", "name", "elo" FROM `competitors`;--> statement-breakpoint
DROP TABLE `competitors`;--> statement-breakpoint
ALTER TABLE `__new_competitors` RENAME TO `competitors`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bracketId` integer NOT NULL,
	`competitorAId` integer NOT NULL,
	`competitorBId` integer NOT NULL,
	`outcome` text NOT NULL,
	`notes` text NOT NULL,
	FOREIGN KEY (`bracketId`) REFERENCES `brackets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`competitorAId`) REFERENCES `competitors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`competitorBId`) REFERENCES `competitors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_results`("id", "bracketId", "competitorAId", "competitorBId", "outcome", "notes") SELECT "id", "bracketId", "competitorAId", "competitorBId", "outcome", "notes" FROM `results`;--> statement-breakpoint
DROP TABLE `results`;--> statement-breakpoint
ALTER TABLE `__new_results` RENAME TO `results`;