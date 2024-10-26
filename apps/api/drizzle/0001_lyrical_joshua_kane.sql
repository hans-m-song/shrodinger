ALTER TABLE "playbook_runs" RENAME COLUMN "playbookRunId" TO "playbook_run_id";--> statement-breakpoint
ALTER TABLE "playbook_runs" RENAME COLUMN "playbookId" TO "playbook_id";--> statement-breakpoint
ALTER TABLE "playbook_runs" RENAME COLUMN "startedAt" TO "started_at";--> statement-breakpoint
ALTER TABLE "playbook_runs" RENAME COLUMN "completedAt" TO "completed_at";--> statement-breakpoint
ALTER TABLE "playbook_runs" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "playbook_runs" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "playbooks" RENAME COLUMN "playbookId" TO "playbook_id";--> statement-breakpoint
ALTER TABLE "playbooks" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "playbooks" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "playbook_runs" DROP CONSTRAINT "playbook_runs_playbookId_playbooks_playbookId_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playbook_runs" ADD CONSTRAINT "playbook_runs_playbook_id_playbooks_playbook_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbooks"("playbook_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "playbook_runs" DROP COLUMN IF EXISTS "deletedAt";--> statement-breakpoint
ALTER TABLE "playbooks" DROP COLUMN IF EXISTS "deletedAt";