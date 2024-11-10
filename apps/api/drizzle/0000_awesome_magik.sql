CREATE TABLE IF NOT EXISTS "playbook_run_logs" (
	"playbook_run_id" integer NOT NULL,
	"sequence" integer NOT NULL,
	"contents" json,
	CONSTRAINT "playbook_run_logs_playbook_run_id_sequence_pk" PRIMARY KEY("playbook_run_id","sequence")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playbook_runs" (
	"playbook_run_id" serial PRIMARY KEY NOT NULL,
	"playbook_id" integer NOT NULL,
	"playbook_version" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"started_at" integer,
	"completed_at" integer,
	"version" bigint DEFAULT 1 NOT NULL,
	"created_at" bigint DEFAULT EXTRACT(epoch FROM CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playbooks" (
	"playbook_id" serial PRIMARY KEY NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"filepath" text NOT NULL,
	"version" bigint DEFAULT 1 NOT NULL,
	"created_at" bigint DEFAULT EXTRACT(epoch FROM CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" bigint,
	CONSTRAINT "playbooks_filepath_unique" UNIQUE("filepath")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playbook_run_logs" ADD CONSTRAINT "playbook_run_logs_playbook_run_id_playbook_runs_playbook_run_id_fk" FOREIGN KEY ("playbook_run_id") REFERENCES "public"."playbook_runs"("playbook_run_id") ON DELETE cascade ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playbook_runs" ADD CONSTRAINT "playbook_runs_playbook_id_playbooks_playbook_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."playbooks"("playbook_id") ON DELETE cascade ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
