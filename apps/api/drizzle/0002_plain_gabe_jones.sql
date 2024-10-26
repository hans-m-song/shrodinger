ALTER TABLE "playbook_runs" ALTER COLUMN "version" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "playbook_runs" ALTER COLUMN "created_at" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "playbook_runs" ALTER COLUMN "updated_at" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "playbooks" ALTER COLUMN "version" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "playbooks" ALTER COLUMN "created_at" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "playbooks" ALTER COLUMN "updated_at" SET DATA TYPE bigint;