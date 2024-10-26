CREATE TABLE IF NOT EXISTS "playbook_runs" (
	"playbookRunId" serial PRIMARY KEY NOT NULL,
	"playbookId" integer,
	"status" text NOT NULL,
	"contents" text,
	"startedAt" integer,
	"completedAt" integer,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" integer NOT NULL,
	"updatedAt" integer NOT NULL,
	"deletedAt" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playbooks" (
	"playbookId" serial PRIMARY KEY NOT NULL,
	"filepath" text NOT NULL,
	"contents" json NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"createdAt" integer NOT NULL,
	"updatedAt" integer NOT NULL,
	"deletedAt" integer,
	CONSTRAINT "playbooks_filepath_unique" UNIQUE("filepath")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playbook_runs" ADD CONSTRAINT "playbook_runs_playbookId_playbooks_playbookId_fk" FOREIGN KEY ("playbookId") REFERENCES "public"."playbooks"("playbookId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
