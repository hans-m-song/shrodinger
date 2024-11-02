ALTER TABLE "playbook_runs" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "playbook_runs" ALTER COLUMN "version" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "playbook_runs" ALTER COLUMN "created_at" SET DEFAULT extract(epoch from current_timestamp);--> statement-breakpoint
ALTER TABLE "playbook_runs" ALTER COLUMN "updated_at" SET DEFAULT extract(epoch from current_timestamp);--> statement-breakpoint
ALTER TABLE "playbooks" ALTER COLUMN "version" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "playbooks" ALTER COLUMN "created_at" SET DEFAULT extract(epoch from current_timestamp);--> statement-breakpoint
ALTER TABLE "playbooks" ALTER COLUMN "updated_at" SET DEFAULT extract(epoch from current_timestamp);--> statement-breakpoint
ALTER TABLE "playbooks" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "playbook_runs" DROP COLUMN IF EXISTS "contents";