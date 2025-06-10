import { sql } from "drizzle-orm";
import { index, pgTable, pgTableCreator, text, varchar, vector } from "drizzle-orm/pg-core";
import { type Message } from "ai"; 

import { nanoid } from "~/lib/utils"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `t3-chat-app_${name}`); 

type Messages = Message[]

export const chats = createTable(
  "chat",
  (d) => ({
    id: d.varchar({ length: 256 }).primaryKey().notNull(),
    name: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    messages: d.
    jsonb('messages')
    .$type<Messages>()
    .default([]),
  }),
  (t) => [index("chat_name_idx").on(t.name)]
);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const embeddings = pgTable('embeddings', {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: varchar('id', { length: 256 }).references(
      () => posts.id,
      { onDelete: 'cascade' },
    ),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  table => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
);