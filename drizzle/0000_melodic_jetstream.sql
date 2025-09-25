CREATE TABLE "docs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "docs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" varchar(10) NOT NULL,
	"doc_name" varchar(255) NOT NULL,
	"owner_id" integer NOT NULL,
	"last_editor_id" integer NOT NULL,
	"last_edited" timestamp DEFAULT now() NOT NULL,
	"num_ref" integer NOT NULL,
	CONSTRAINT "docs_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"uuid" varchar(36) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" integer NOT NULL,
	"team_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_doc_junc" (
	"team_id" integer NOT NULL,
	"doc_id" integer NOT NULL,
	CONSTRAINT "team_doc_junc_team_id_doc_id_pk" PRIMARY KEY("team_id","doc_id")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "teams_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" varchar(10) NOT NULL,
	"team_name" varchar(255) NOT NULL,
	"team_desc" text NOT NULL,
	"owner_id" integer NOT NULL,
	CONSTRAINT "teams_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "user_team_junc" (
	"user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"add_user_perm" boolean NOT NULL,
	"remove_user_perm" boolean NOT NULL,
	"add_doc_perm" boolean NOT NULL,
	"remove_doc_perm" boolean NOT NULL,
	"delete_team_perm" boolean DEFAULT true NOT NULL,
	CONSTRAINT "user_team_junc_team_id_user_id_pk" PRIMARY KEY("team_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "user_doc_junc" (
	"user_id" integer NOT NULL,
	"doc_id" integer NOT NULL,
	"remove_doc_perm" boolean NOT NULL,
	"add_user_perm" boolean NOT NULL,
	CONSTRAINT "user_doc_junc_doc_id_user_id_pk" PRIMARY KEY("doc_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" varchar(10) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "docs" ADD CONSTRAINT "docs_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "docs" ADD CONSTRAINT "docs_last_editor_id_users_id_fk" FOREIGN KEY ("last_editor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_doc_junc" ADD CONSTRAINT "team_doc_junc_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_doc_junc" ADD CONSTRAINT "team_doc_junc_doc_id_docs_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_team_junc" ADD CONSTRAINT "user_team_junc_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_team_junc" ADD CONSTRAINT "user_team_junc_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_doc_junc" ADD CONSTRAINT "user_doc_junc_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_doc_junc" ADD CONSTRAINT "user_doc_junc_doc_id_docs_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "public_id_idx" ON "docs" USING btree ("public_id");