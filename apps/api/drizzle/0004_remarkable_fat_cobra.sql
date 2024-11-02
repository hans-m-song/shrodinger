CREATE TABLE IF NOT EXISTS "playbook_run_logs" (
	"playbook_run_id" integer NOT NULL,
	"sequence" serial NOT NULL,
	"contents" json,
	CONSTRAINT "playbook_run_logs_playbook_run_id_sequence_pk" PRIMARY KEY("playbook_run_id","sequence")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playbook_run_logs" ADD CONSTRAINT "playbook_run_logs_playbook_run_id_playbook_runs_playbook_run_id_fk" FOREIGN KEY ("playbook_run_id") REFERENCES "public"."playbook_runs"("playbook_run_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
