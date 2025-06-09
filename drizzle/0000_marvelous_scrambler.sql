CREATE TABLE "t3-chat-app_chat" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	"messages" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE INDEX "chat_name_idx" ON "t3-chat-app_chat" USING btree ("name");