
import { pgTable, text } from "drizzle-orm/pg-core";

export const accounts = pgTable('accounts', {
    id: text('id').primaryKey(),    
    name: text('name').notNull(),
    power: text('power').notNull(),
    userId: text('user_id').notNull(),
})